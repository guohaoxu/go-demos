package main

import (
	"go-demos/taskmanager/routers"
	"go-demos/taskmanager/utils"
	"log"
	"net/http"

	"github.com/codegangsta/negroni"
)

func main() {
	utils.InitConfig()
	utils.InitKeys()
	utils.CreateDbSession()
	utils.AddIndexes()
	router := routers.InitRoutes()

	n := negroni.Classic()
	n.UseHandler(router)

	server := &http.Server{
		Addr:    utils.AppConfig.Server,
		Handler: n,
	}
	log.Printf("Listening at: %s", utils.AppConfig.Server)
	server.ListenAndServe()
}
