package main

import (
	"fmt"
	"net"
)

func main() {
	conn, _ := net.Dial("tcp", "localhost:9982")
	fmt.Println("send data")
	_, _ = conn.Write([]byte("message from client"))
	defer conn.Close()
}
