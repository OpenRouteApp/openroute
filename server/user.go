package main

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	pb "server/proto"
)

func (s *server) RegisterUser(ctx context.Context, req *pb.RegisterUserReq) (*pb.User, error) {
	// This is a stub implementation. Add real DB/storage logic here.
	id := uuid.New().String()

	fmt.Printf("Registering user: %s\n", req.Username)

	return &pb.User{
		Id:		   &pb.Uuid{Value: id},       	
		Username:  req.Username, 
	}, nil
}

func (s *server) GetUser(ctx context.Context, req *pb.Uuid) (*pb.User, error) {
	// Fetch user from storage by ID
	return &pb.User{
		Id:        req,
		Username:  "openroute-dummy-user", 
	}, nil
}
