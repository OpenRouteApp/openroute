package main

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	pb "server/proto"
)

func (s *server) CreateProposal(ctx context.Context, req *pb.CreateProposalReq) (*pb.Uuid, error) {
	id := uuid.New().String()

	fmt.Printf("New proposal from user %s for route %+v\n", req.UserId, req.Route)

	return &pb.Uuid{Value: id}, nil
}

func (s *server) GetProposal(ctx context.Context, req *pb.Uuid) (*pb.Proposal, error) {
	// Dummy response
	return &pb.Proposal{
		Route: &pb.Route{
			StartLat: 10.0,
			StartLng: 20.0,
			EndLat:   11.0,
			EndLng:   21.0,
		},
		UserId: "user-123",
		State:  pb.Proposal_APPROVED,
	}, nil
}
