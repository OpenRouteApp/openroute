FROM rust:1.87-alpine AS builder

# Install musl-dev and protobuf compiler for static linking and proto generation
RUN apk add --no-cache musl-dev protobuf-dev protoc

WORKDIR /app

COPY . .

ENV PROTO_PATH=/app/proto

RUN cargo build --release

FROM alpine:latest

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/target/release/vote-manager /usr/local/bin/vote-manager

ENTRYPOINT ["/usr/local/bin/vote-manager"]
