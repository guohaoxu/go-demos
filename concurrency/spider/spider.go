package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"time"
)

// var foundUrls []string
var urls []string
var totalURLCount int
var urlsProcessed int
var fullText string

var wg *sync.WaitGroup

func readURLs(statusChannel chan int, textChannel chan string) error {
	defer wg.Done()
	time.Sleep(time.Millisecond * 1)
	for i := 0; i < totalURLCount; i++ {
		resp, err := http.Get(urls[i])
		if err != nil {
			return err
		}
		textByte, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		textChannel <- string(textByte)
		statusChannel <- 0
	}
	return nil
}

func addToScrapedText(textChannel chan string, processChannel chan bool) {
	defer wg.Done()
	for {
		select {
		case pC := <-processChannel:
			if pC == false {
				fmt.Println("--aaa------")
				close(textChannel)
				close(processChannel)
				break
			}
		case tC := <-textChannel:
			fullText += tC
		}
	}
}

func evaluateStatus(statusChannel chan int, processChannel chan bool) {
	defer wg.Done()
	for {
		select {
		case status := <-statusChannel:
			urlsProcessed++
			if status == 0 {
				fmt.Println("Got url", urlsProcessed)
			}
			if urlsProcessed == totalURLCount {
				fmt.Println("Read all URLs")
				fmt.Println(urlsProcessed, "++++")

				close(statusChannel)
				processChannel <- false
			}
		}
	}
}

func main() {
	// runtime.GOMAXPROCS(runtime.NumCPU())

	wg = new(sync.WaitGroup)
	statusChannel := make(chan int)
	textChannel := make(chan string)
	processChannel := make(chan bool)

	urls = append(urls, "http://localhost:3001/pkg/")
	urls = append(urls, "http://localhost:3001/pkg/")
	urls = append(urls, "http://localhost:3001/pkg/")
	urls = append(urls, "http://localhost:3001/pkg/")
	urls = append(urls, "http://localhost:3001/pkg/")

	urlsProcessed = 0
	totalURLCount = len(urls)

	fmt.Println("Starting spider")

	go evaluateStatus(statusChannel, processChannel)
	go readURLs(statusChannel, textChannel)
	go addToScrapedText(textChannel, processChannel)
	//
	// for {
	// 	if applicationStatus == false {
	// 		// fmt.Println(fullText)
	// 		fmt.Println("Done!")
	// 		break
	// 	}
	// 	select {
	// 	case sC := <-statusChannel:
	// 		fmt.Println("Message on StatusChannel", sC)
	// 	}
	// }

	wg.Add(3)
	wg.Wait()
}
