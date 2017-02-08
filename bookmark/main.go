package main

import (
	"go-demos/bookmark/routers"
	"log"
	"net/http"
)

func main() {
	common.StartUp()
	router := routers.InitRoutes()
	server := &http.Server{
		Addr:    common.AppConfig.Server,
		Handler: router,
	}
	log.Println("Listening...")
	server.ListenAndServer()
}
