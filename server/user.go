package main

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/timestamppb"
	pb "openRoute/orpb"
)

func (s *server) RegisterUser(ctx context.Context, req *pb.RegisterUserReq) (*pb.User, error) {
	// This is a stub implementation. Add real DB/storage logic here.
	id := uuid.New().String()

	fmt.Printf("Registering user: %s\n", req.Username)

	return &pb.User{
		Id:		   &pb.Uuid{Value: id},       	
		Username:  req.Username, 
		CreatedAt: timestamppb.New(time.Now()),
	}, nil
}

func (s *server) GetUser(ctx context.Context, req *pb.Uuid) (*pb.User, error) {
	// Fetch user from storage by ID
	return &pb.User{
		Id:        req,
		Username:  "openroute-dummy-user", 
		CreatedAt: timestamppb.New(time.Now()),
	}, nil
}
