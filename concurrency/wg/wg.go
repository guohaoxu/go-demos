package main

import (
	"fmt"
	"runtime"
	"sync"
)

func multiTable(wg *sync.WaitGroup) {
	defer wg.Done()

	for i := 1; i < 10; i++ {
		for j := 1; j <= i; j++ {
			fmt.Printf("%d*%d=%d\t", j, i, i*j)
		}
		fmt.Printf("\n")
	}
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	wg := new(sync.WaitGroup)
	go multiTable(wg)
	go multiTable(wg)

	runtime.Gosched()
	fmt.Printf("runtime.NumCPU(): %d", runtime.NumCPU())

	wg.Add(2)
	wg.Wait()
}
