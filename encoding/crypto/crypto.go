package main

import (
	"crypto/md5"
	"crypto/sha256"
	"fmt"
)

func main() {
	message := "Hello world, Go"

	m := md5.New()
	m.Write([]byte(message))
	m_message := m.Sum(nil)
	fmt.Println(string(m_message))

	s := sha256.New()
	s.Write([]byte(message))
	s_message := s.Sum(nil)
	fmt.Println(string(s_message))
}
