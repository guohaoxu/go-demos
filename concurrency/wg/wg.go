package main

import (
	"fmt"
	"runtime"
	"sync"
)

func multiTable(goGroup *sync.WaitGroup) {
	defer goGroup.Done()
	for i := 1; i < 10; i++ {
		for j := 1; j <= i; j++ {
			fmt.Printf("%d*%d=%d\t", j, i, i*j)
		}
		fmt.Printf("\n")
	}
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	goGroup := new(sync.WaitGroup)
	go multiTable(goGroup)

	runtime.Gosched()
	fmt.Printf("runtime.NumCPU(): %d", runtime.NumCPU())

	goGroup.Add(1)
	goGroup.Wait()
}

// 454026
