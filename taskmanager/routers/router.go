package routers

import (
	"go-demos/taskmanager/controllers"
	"go-demos/taskmanager/utils"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/users/register", controllers.Register).Methods("POST")
	router.HandleFunc("/users/login", controllsers.Login).Methods("POST")

	router.PathPrefix("/tasks").Handler(negroni.New(
		negroni.HandlerFunc(utils.Authorize),
		negroni.Wrap(taskRouter),
	))
	router.HandleFunc("/tasks", controllers.GetTasks).Methods("GET")
	router.HandleFunc("/tasks", controllers.CreateTask).Methods("POST")
	router.HandleFunc("/tasks/{id}", controllers.GetTaskById).Methods("GET")
	router.HandleFunc("/tasks/{id}", controllers.UpdateTask).Methods("PUT")
	router.HandleFunc("/tasks/{id}", controllers.DeleteTask).Methods("DELETE")
	router.HandleFunc("/tasks/users/{id}", controllers.GetTasksByUser).Methods("GET")

	return router
}
