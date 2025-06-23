package main

import (
	"log"
	"net"

	"google.golang.org/grpc"
	"user"
	pb "openRoute/orpb"
)

type server struct {
	pb.UnimplementedProposalServiceServer
	pb.UnimplementedUserServiceServer
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	signal := &SignalProtocol{}
	s := grpc.NewServer(
			grpc.ChainUnaryInterceptor(
            user.SignalInterceptor(signal),
        ),)

	pb.RegisterUserServiceServer(s, &server{})
	pb.RegisterProposalServiceServer(s, &server{})

	log.Println("gRPC server listening on :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
