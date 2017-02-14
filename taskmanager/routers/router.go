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

	r.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.DisplayAppError(w, "404", http.StatusNotFound)
	})

	r.Handle("/users/register", MyHandler(controllers.Register)).Methods("POST")
	r.Handle("/users/login", MyHandler(controllers.Login)).Methods("POST")

	r.Handle("/tasks", MyHandler(utils.Auth(controllers.GetTasks))).Methods("GET")
	r.Handle("/tasks", MyHandler(utils.Auth(controllers.CreateTask))).Methods("POST")
	r.Handle("/tasks/{id}", MyHandler(utils.Auth(controllers.GetTaskById))).Methods("GET")
	r.Handle("/tasks/{id}", MyHandler(utils.Auth(controllers.UpdateTask))).Methods("PUT")
	r.Handle("/tasks/{id}", MyHandler(utils.Auth(controllers.DeleteTask))).Methods("DELETE")
	r.Handle("/tasks/users/{username}", MyHandler(utils.Auth(controllers.GetTasksByUser))).Methods("GET")

	return r
}
