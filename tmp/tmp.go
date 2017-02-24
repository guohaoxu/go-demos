package main

import "fmt"

func main() {
	c := make(chan int)
	go func() {
		fmt.Println("goroutine process")
		c <- 10
	}()
	fmt.Printf("value: %d\n", <-c)
}
