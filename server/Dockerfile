FROM golang:1.23-alpine

WORKDIR /app

COPY . .

RUN go mod tidy && go build -o server .

EXPOSE 50051

CMD ["./server"]
