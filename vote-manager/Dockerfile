FROM clux/muslrust:1.87.0-stable AS builder

WORKDIR /app

COPY . .

ENV PROTO_PATH=/app/proto

RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM scratch

COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/vote-manager /usr/local/bin/vote-manager

ENTRYPOINT ["/usr/local/bin/vote-manager"]
