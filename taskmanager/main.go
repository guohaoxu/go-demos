// A RESTful API with jwt
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

	r := routers.InitRoutes()
	server := &http.Server{
		Addr:    utils.AppConfig.Server,
		Handler: r,
	}
	log.Printf("Listening at: %s", utils.AppConfig.Server)
	server.ListenAndServe()
}
