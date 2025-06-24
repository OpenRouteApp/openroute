use std::sync::{Arc, atomic::{AtomicUsize, Ordering}};
use std::time::Duration;
use tokio::sync::OnceCell;
use tonic::{transport::Server, Request, Response, Status};
use votemanager::vote_service_server::{VoteService, VoteServiceServer};
use votemanager::{GetRoutesResponse, StartResponse};
use types::{Route, Empty};
use prost::Message;
use sled;

pub mod votemanager {
    tonic::include_proto!("votemanager");
}
pub mod types {
    tonic::include_proto!("types");
}

#[derive(Clone)]
pub struct Service {
    db: Arc<sled::Db>,
    route_counter: Arc<AtomicUsize>,
    started: Arc<OnceCell<()>>,
}

#[tonic::async_trait]
impl VoteService for Service {
    async fn start(&self, _request: Request<Empty>) -> Result<Response<StartResponse>, Status> {
        if self.started.set(()).is_ok() {
            let db = self.db.clone();
            let counter = self.route_counter.clone();
            tokio::spawn(async move {
                loop {
                    let id = counter.fetch_add(1, Ordering::Relaxed);
                    let route = Route {
                        start_lat: id as f64,
                        start_lng: id as f64 + 1.0,
                        end_lat: id as f64 + 2.0,
                        end_lng: id as f64 + 3.0,
                    };

                    let mut buf = Vec::new();
                    route.encode(&mut buf).unwrap();

                    db.insert(id.to_be_bytes(), buf).unwrap();
                    tokio::time::sleep(Duration::from_secs(10)).await;
                }
            });
        }

        Ok(Response::new(StartResponse { value: 1 }))
    }

    async fn get_routes(&self, _request: Request<Empty>) -> Result<Response<GetRoutesResponse>, Status> {
        let mut routes = Vec::new();

        for entry in self.db.iter() {
            let (_key, value) = entry.map_err(|e| Status::internal(e.to_string()))?;
            let route = Route::decode(value.as_ref()).map_err(|e| Status::internal(e.to_string()))?;
            routes.push(route);
        }

        Ok(Response::new(GetRoutesResponse { routes }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::]:50051".parse()?;
    let db = sled::open("routes_db")?;

    let service = Service {
        db: Arc::new(db),
        route_counter: Arc::new(AtomicUsize::new(0)),
        started: Arc::new(OnceCell::new()),
    };

    println!("Server listening on {}", addr);

    Server::builder()
        .add_service(VoteServiceServer::new(service))
        .serve(addr)
        .await?;

    Ok(())
}
