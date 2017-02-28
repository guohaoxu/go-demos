package main

import (
	"fmt"
	"runtime"
	"strings"
	"sync"
)

var loremIpsum string
var finalIpsum string
var letterSentChan chan string

func capitalize(current *int, length int, letters []byte, finalIpsum *string, goGroup *sync.WaitGroup) {
	defer goGroup.Done()
	for *current < length {
		thisLetter := strings.ToUpper(string(letters[*current]))
		*finalIpsum += thisLetter
		*current++
	}
}

func init() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	goGroup := new(sync.WaitGroup)

	index := new(int)
	*index = 0
	loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum venenatis magna eget libero tincidunt, acondimentum enim auctor. Integer mauris arcu, dignissim sit amet convallis vitae, ornare vel odio. Phasellus in lectus risus. Ut sodales vehicula ligula eu ultricies. Fusce vulputate fringilla eros at congue. Nulla tempor neque enim, non malesuada arcu laoreet quis. Aliquam eget magna metus. Vivamus lacinia venenatis dolor, blandit faucibus mi iaculis quis. Vestibulum sit amet feugiat ante, eu porta justo."
	letters := []byte(loremIpsum)
	length := len(letters)

	go capitalize(index, length, letters, &finalIpsum, goGroup)

	goGroup.Add(1)
	goGroup.Wait()
	fmt.Println(finalIpsum)
}
