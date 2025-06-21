package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	pb "openRoute/orpb"
)

type server struct {
	pb.UnimplementedNumberServiceServer
}

func (s *server) SendNumber(ctx context.Context, req *pb.NumberRequest) (*pb.NumberResponse, error) {
	return &pb.NumberResponse{Message: fmt.Sprintf("Echoed blazingly fast through RPC: %d", req.Value)}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterNumberServiceServer(s, &server{})
	log.Println("gRPC server listening on :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
