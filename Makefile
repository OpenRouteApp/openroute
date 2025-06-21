.PHONY: proto build up down clean

PROTO_DIR=proto
OUT_DIR=server/numberpb

proto:
	mkdir -p $(OUT_DIR)
	protoc -I=$(PROTO_DIR) \
		--go_out=$(OUT_DIR) \
		--go-grpc_out=$(OUT_DIR) \
		--go_opt=paths=source_relative \
		--go-grpc_opt=paths=source_relative \
		$(PROTO_DIR)/number.proto

	mkdir -p web/generated
	protoc -I=$(PROTO_DIR) \
		--js_out=import_style=commonjs:web/generated \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:web/generated \
		$(PROTO_DIR)/number.proto

	protoc -I=$(PROTO_DIR) \
		--include_imports \
		--include_source_info \
		--descriptor_set_out=number.pb \
		$(PROTO_DIR)/number.proto

build:
	docker-compose build

up:
	docker-compose up

down:
	docker-compose down

clean:
	rm -rf $(OUT_DIR)/*.pb.go number.pb
