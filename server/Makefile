PROTO_DIR=../proto
OUT_DIR=./proto
PROTO_FILES=$(PROTO_DIR)/types.proto $(PROTO_DIR)/server.proto

.PHONY: all proto build clean

all: build

proto:
	mkdir -p $(OUT_DIR)
	protoc -I=$(PROTO_DIR) \
		--go_out=$(OUT_DIR) \
		--go-grpc_out=$(OUT_DIR) \
		--go_opt=paths=source_relative \
		--go-grpc_opt=paths=source_relative \
		$(PROTO_FILES)

build: proto
	go build -o bin/go-ms main.go


docker: proto
	docker build -t openroute-server:latest .

clean:
	rm -rf $(OUT_DIR)
