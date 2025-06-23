package main

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/timestamppb"
	pb "openRoute/orpb"
)

type SignalProtocol struct{}

func (s *SignalProtocol) Encrypt(message string) string  {
    return fmt.Sprintf("ENCRYPTED[%s]", message)
}

func (s *SignalProtocol) Decrypt(encryptedMsg string) (string, error) {
	return strings.Replace(encryptedMsg, "ENCRYPTED", "PLAIN", 1)
}

func SignalInterceptor(signal *SignalProtocol) grpc.UnaryServerInterceptor {
    return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
        
        if md, ok := metadata.FromIncomingContext(ctx); !ok {
            return handler(ctx, req)
        }
        
		// NEKRONOS: Weird ass type assertion shit, GetEncryptedPayload should be generated on protobuf compilation
        if encryptedReq, ok := req.(interface{ GetEncryptedPayload() string }); ok {
            decryptedPayload, err := signal.Decrypt(encryptedReq.GetEncryptedPayload())
            if err != nil {
                return nil, fmt.Errorf("failed to decrypt request: %v", err)
            }
            log.Printf("Decrypted message: %s", decryptedPayload)
        }
        
        // Call the actual handler
        resp, err := handler(ctx, req); err != nil {
            return nil, err
        }
        
        if resp != nil {
			// Gotta encrypt the response somehow
        }
        
        return resp, nil
    }
}


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
