package main

import (
	"fmt"
	"math/rand"
	"runtime"
	"sync"
	"time"
)

var wg sync.WaitGroup

func main() {
	runtime.GOMAXPROCS(4)

	// Add a count of two
	wg.Add(2)

	go addTable()
	go multiTable()

	// Wait for the goroutine to finish
	wg.Wait()
}

func addTable() {
	defer wg.Done()
	for i := 1; i <= 10; i++ {
		sleep := rand.Int63n(1000)
		time.Sleep(time.Duration(sleep) * time.Millisecond)
		fmt.Println("Addition Table for:", i)
		for j := 1; j <= 10; j++ {
			fmt.Printf("%d+%d=%d\t", i, j, i+j)
		}
		fmt.Println("\n")
	}
}

func multiTable() {
	defer wg.Done()
	for i := 1; i <= 10; i++ {
		sleep := rand.Int63n(1000)
		time.Sleep(time.Duration(sleep) * time.Millisecond)
		fmt.Println("Multiplication Table for:", i)
		for j := 1; j <= 10; j++ {
			fmt.Printf("%d*%d=%d\t", i, j, i*j)
		}
		fmt.Println("\n")
	}
}
