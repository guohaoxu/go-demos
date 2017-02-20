package main

import "fmt"

func main() {
	fmt.Println("simple channel")

	c := make(chan int)

	go func() {
		fmt.Println("goroutine process")
		c <- 10
	}()

	fmt.Printf("value: %d\n", <-c)
}
