package main

import (
	"go-demos/taskmanager/routers"
	"go-demos/taskmanager/utils"
	"log"
	"net/http"

	"github.com/codegangsta/negroni"
)

func main() {

	// Initialize AppConfig variable
	utils.InitConfig()
	// Initialize private/public keys for JWT authentication
	utils.InitKeys()
	// Start a MongoDB session
	utils.CreateDbSession()
	// Add indexes into MongoDB
	utils.AddIndexes()

	router := routers.InitRoutes()

	n := negroni.Classic()
	n.useHandler(router)
	server := &http.Server{
		Addr:    utils.AppConfig.Server,
		Handler: n,
	}
	log.Println("Listening....")
	server.ListenAndServer()
}
