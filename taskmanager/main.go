package main

import (
	"go-demos/taskmanager/routers"
	"go-demos/taskmanager/utils"
	"log"
	"net/http"
)

func main() {
	utils.InitConfig()
	utils.InitKeys()
	utils.CreateDbSession()
	utils.AddIndexes()
	router := routers.InitRoutes()

	server := &http.Server{
		Addr:    utils.AppConfig.Server,
		Handler: router,
	}
	log.Printf("Listening at: %s", utils.AppConfig.Server)
	server.ListenAndServe()
}
