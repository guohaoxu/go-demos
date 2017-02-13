// A RESTful API with jwt
package main

import (
	"go-demos/taskmanager/routers"
	"go-demos/taskmanager/utils"
	"log"

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
	n.Run(utils.AppConfig.Server)
	log.Printf("Listening at: %s", utils.AppConfig.Server)
}
