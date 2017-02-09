package routers

import "github.com/gorilla/mux"

func SetUserRoutes(router *mux.Router) *mux.Router {
	router.HandleFunc("/users/register", controllers.Register).Methods("POST")
	router.HandleFunc("/users/login", controllsers.Login).Methods("POST")
	return router
}
