package main

import (
	"flag"
	"fmt"
)

func main() {
	fileName := flag.String("filename", "logfile", "File name for the log file")
	logLevel := flag.Int("loglevel", 0, "An integer value for Level (0-4)")
	isEnable := flag.Bool("enable", false, "A boolean value for enabling log options")
	var num int
	flag.IntVar(&num, "num", 25, "An integer value")

	flag.Parse()
	fmt.Println("filename:", *fileName)
	fmt.Println("loglevel:", *logLevel)
	fmt.Println("enable:", *isEnable)

	fmt.Println("num:", num)
	args := flag.Args()
	if len(args) > 0 {
		fmt.Println("The non-flag command-line arguments are:")
		for _, v := range args {
			fmt.Println(v)
		}
	}
	/*
	  ./flag.exe -filename=applog -loglevel=2 -enable -num=50 10 20 30 test
	*/
	/*
	   filename: applog
	   loglevel: 2
	   enable: true
	   num: 50
	   The non-flag command-line arguments are:
	   10
	   20
	   30
	   test
	*/
}
