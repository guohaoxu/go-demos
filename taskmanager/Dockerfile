# golang image where workspace (GOPATH) configured at /go.
FROM golang

# Copy the local package files to the containe's workspace.
ADD ./go/src/github.com/shijuvar/go-web/taskmanager

# Setting up working directory
WORKDIR /go/src/github.com/shijuvar/go-web/taskmanager

# Get godeps for managing and restoring dependencies
RUN go get github.com/tools/godep

# Restore godep dependencies
RUN godep restore

# Build the taskmanager command inside the container.
RUN go instal github.com/shijuvar/go-web/taskmanager

# Run the taskmanger command when the container starts.
ENTRYPOINT /go/bin/taskmanager

# Service listens on port 8080.
EXPOSE 8080

# docker build -t taskmanager
# docker run --publish 80:8080 --name taskmanager_api --rm taskmanager
