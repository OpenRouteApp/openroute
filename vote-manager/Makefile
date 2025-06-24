.PHONY: all build clean

all: build

build:
	cargo build --release

docker: prepare-proto
	docker build -t openroute-vote-manager:latest .

prepare-proto:
	rm -rf ./proto
	mkdir -p ./proto
	cp -r ../proto/* ./proto

clean:
	cargo clean
	rm -rf ./proto
