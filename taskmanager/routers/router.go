package routers

import (
	"go-demos/taskmanager/controllers"
	"go-demos/taskmanager/utils"

	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/users/register", controllers.Register).Methods("POST")
	router.HandleFunc("/users/login", controllers.Login).Methods("POST")

	router.HandleFunc("/tasks", utils.Auth(controllers.GetTasks)).Methods("GET")
	router.HandleFunc("/tasks", utils.Auth(controllers.CreateTask)).Methods("POST")
	router.HandleFunc("/tasks/{id}", utils.Auth(controllers.GetTaskById)).Methods("GET")
	router.HandleFunc("/tasks/{id}", utils.Auth(controllers.UpdateTask)).Methods("PUT")
	router.HandleFunc("/tasks/{id}", utils.Auth(controllers.DeleteTask)).Methods("DELETE")
	router.HandleFunc("/tasks/users/{username}", utils.Auth(controllers.GetTasksByUser)).Methods("GET")

	return router
}
