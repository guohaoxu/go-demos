package routers

import (
	"go-demos/taskmanager/controllers"
	"go-demos/taskmanager/utils"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/justinas/alice"
)

// handlers.AllowedOrigins([]string{"http://localhost:3002"})
func corsHandler(next http.Handler) http.Handler {
	return handlers.CORS()(next)
}

func loggingHandler(next http.Handler) http.Handler {
	logFile, err := os.OpenFile("server.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0777)
	if err != nil {
		panic(err)
	}
	return handlers.CombinedLoggingHandler(logFile, next)
}

// recoveryHandler and CompressHandler download .gz --#
func recoveryHandler(next http.Handler) http.Handler {
	return handlers.RecoveryHandler()(next)
}

func MyHandler(next http.HandlerFunc) http.Handler {
	return alice.New(corsHandler, loggingHandler, handlers.CompressHandler).ThenFunc(next)
}

func InitRoutes() *mux.Router {
	r := mux.NewRouter()

	r.Handle("/tasks", MyHandler(controllers.GetTasks)).Methods("GET")

	r.Handle("/error", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("Unexpected error!")
	}))

	r.HandleFunc("/users/register", controllers.Register).Methods("POST")
	r.HandleFunc("/users/login", controllers.Login).Methods("POST")

	r.HandleFunc("/tasks", utils.Auth(controllers.CreateTask)).Methods("POST")
	r.HandleFunc("/tasks/{id}", utils.Auth(controllers.GetTaskById)).Methods("GET")
	r.HandleFunc("/tasks/{id}", utils.Auth(controllers.UpdateTask)).Methods("PUT")
	r.HandleFunc("/tasks/{id}", utils.Auth(controllers.DeleteTask)).Methods("DELETE")
	r.HandleFunc("/tasks/users/{username}", utils.Auth(controllers.GetTasksByUser)).Methods("GET")

	return r
}
