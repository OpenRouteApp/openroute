PROTO_DIR := ../proto
PROTO_COPY_DIR := proto
DESC_DIR := descriptors
OUT_DIR := dist
DESCRIPTOR_FILE := $(DESC_DIR)/services.pb

PROTOC := protoc
PROTOC_GEN_GRPC_WEB := protoc-gen-grpc-web
JS_OUT_FLAGS := import_style=commonjs,binary
GRPC_WEB_OUT_FLAGS := import_style=commonjs,mode=grpcwebtext

.PHONY: all prepare descriptor build clean

all: clean build

# ======================== COPY FILES
prepare:
	@mkdir -p $(PROTO_COPY_DIR) $(DESC_DIR) $(OUT_DIR)
	@echo "Copying .proto files from $(PROTO_DIR)..."
	@cp $(PROTO_DIR)/*.proto $(PROTO_COPY_DIR)/

# ======================== ENVOY DESCRIPTOR
descriptor: prepare
	@echo "Generating descriptor set..."
	$(PROTOC) -I $(PROTO_COPY_DIR) \
		--include_imports --include_source_info \
		--descriptor_set_out=$(DESCRIPTOR_FILE) \
		$(wildcard $(PROTO_COPY_DIR)/*.proto)

# ======================== JS STUBS
build: descriptor prepare
	@echo "Generating JS stubs with protoc-gen-grpc-web..."
	$(PROTOC) -I $(PROTO_COPY_DIR) \
		--js_out=$(JS_OUT_FLAGS):$(OUT_DIR) \
		--grpc-web_out=$(GRPC_WEB_OUT_FLAGS):$(OUT_DIR) \
		$(wildcard $(PROTO_COPY_DIR)/*.proto)

	@echo "// Auto-generated index.js" > $(OUT_DIR)/index.js && \
	for f in $(OUT_DIR)/*.js; do \
		base=$$(basename $$f); \
		if [ "$$base" != "index.js" ]; then \
			echo "export * from './$$base';" >> $(OUT_DIR)/index.js; \
		fi; \
	done

	npx webpack

docker: build
	docker build -t openroute-web:latest .

# ======================== CLEAN
clean:
	@rm -rf $(PROTO_COPY_DIR) $(DESC_DIR) $(OUT_DIR)

