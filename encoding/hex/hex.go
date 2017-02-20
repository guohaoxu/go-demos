package main

import (
	"encoding/hex"
	"fmt"
)

func main() {
	message := "hello,go (*&^^%##"
	fmt.Printf("message: %s\n", message)

	encoding := hex.EncodeToString([]byte(message))
	fmt.Printf("encoding hex message: %s\n", encoding)

	decoding, _ := hex.DecodeString(encoding)
	fmt.Printf("decoding hex message: %s\n", decoding)

	/*
	   message: hello,go (*&^^%##
	   encoding hex message: 68656c6c6f2c676f20282a265e5e252323
	   decoding hex message: hello,go (*&^^%##
	*/
}
