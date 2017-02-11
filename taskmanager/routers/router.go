package routers

import (
	"go-demos/taskmanager/controllers"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/users/register", controllers.Register).Methods("POST")
	router.HandleFunc("/users/login", controllsers.Login).Methods("POST")

	taskRouter.HandleFunc("/tasks", controllers.GetTasks).Methods("GET")
	taskRouter.HandleFunc("/tasks", controllers.CreateTask).Methods("POST")
	taskRouter.HandleFunc("/tasks/{id}", controllers.GetTaskById).Methods("GET")
	taskRouter.HandleFunc("/tasks/{id}", controllers.UpdateTask).Methods("PUT")
	taskRouter.HandleFunc("/tasks/{id}", controllers.DeleteTask).Methods("DELETE")
	taskRouter.HandleFunc("/tasks/users/{id}", controllers.GetTasksByUser).Methods("GET")
	router.PathPrefix("/tasks").Handler(negroni.New(
		negroni.HandlerFunc(utils.Authorize),
		negroni.Wrap(taskRouter),
	))

	return router
}
