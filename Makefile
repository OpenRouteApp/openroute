.PHONY: all proto build webpack up down clean

# Directories
PROTO_DIR := proto
GO_OUT_DIR := server/orpb
WEB_OUT_DIR := web/generated

# Files
PROTO_FILES := $(PROTO_DIR)/types.proto $(PROTO_DIR)/services.proto
DESCRIPTOR_FILE := openroute.pb

# Tools
PROTOC := protoc

all: proto webpack build

proto: $(GO_OUT_DIR) $(WEB_OUT_DIR)
	protoc -I=$(PROTO_DIR) \
		--go_out=$(GO_OUT_DIR) \
		--go-grpc_out=$(GO_OUT_DIR) \
		--go_opt=paths=source_relative \
		--go-grpc_opt=paths=source_relative \
		$(PROTO_FILES)

	protoc -I=$(PROTO_DIR) \
		--js_out=import_style=commonjs:$(WEB_OUT_DIR) \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:$(WEB_OUT_DIR) \
		$(PROTO_FILES)

	protoc -I=$(PROTO_DIR) \
		--include_imports \
		--include_source_info \
		--descriptor_set_out=$(DESCRIPTOR_FILE) \
		$(PROTO_FILES)

	@echo "// Auto-generated index.js" > $(WEB_OUT_DIR)/index.js && \
	for f in $(WEB_OUT_DIR)/*.js; do \
		base=$$(basename $$f); \
		if [ "$$base" != "index.js" ]; then \
			echo "export * from './$$base';" >> $(WEB_OUT_DIR)/index.js; \
		fi; \
	done

webpack:
	cd web && npx webpack 

$(GO_OUT_DIR):
	mkdir -p $(GO_OUT_DIR)

$(WEB_OUT_DIR):
	mkdir -p $(WEB_OUT_DIR)

build:
	docker-compose build

up:
	docker-compose up

down:
	docker-compose down

clean:
	rm -rf $(GO_OUT_DIR)/*.pb.go $(DESCRIPTOR_FILE)
