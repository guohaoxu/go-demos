package main

import (
	"go-demos/taskmanager/common"
	"go-demos/taskmanager/routers"
	"log"
	"net/http"

	"github.com/codegangsta/negroni"
)

func main() {
	common.StartUp()
	router := routers.InitRoutes()
	n := negroni.Classic()
	n.useHandler(router)
	server := &http.Server{
		Addf:    common.AppConfig.Server,
		Handler: n,
	}
	log.Println("Listening....")
	server.ListenAndServer()
}
