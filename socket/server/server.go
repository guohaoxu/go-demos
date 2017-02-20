package main

import (
	"fmt"
	"net"
)

func main() {
	svr, _ := net.Listen("tcp", "localhost:9982")
	defer svr.Close()

	fmt.Println("server is running at localhost:9982")

	for {
		conn, _ := svr.Accept()
		fmt.Println("client connected")
		go handleClient(conn)
	}
}

func handleClient(conn net.Conn) {
	buff := make([]byte, 1024)
	msgLen, _ := conn.Read(buff)
	fmt.Println("Received: ", string(buff[:msgLen]))
	conn.Close()
}
