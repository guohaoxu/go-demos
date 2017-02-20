package main

import (
	"encoding/base64"
	"fmt"
)

func main() {
	message := "hello,go (*&^^%##"
	fmt.Printf("message: %s\n", message)

	encoding := base64.StdEncoding.EncodeToString([]byte(message))
	fmt.Printf("encoding base64 message: %s\n", encoding)

	decoding, _ := base64.StdEncoding.DecodeString(encoding)
	fmt.Printf("decoding base64 message: %s\n", decoding)

	/*
	  message: hello,go (*&^^%##
	  encoding base64 message: aGVsbG8sZ28gKComXl4lIyM=
	  decoding base64 message: hello,go (*&^^%##
	*/
}
