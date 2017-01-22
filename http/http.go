package main

import (
	"fmt"
	"log"
	"net/http"
)

type messageHandler struct {
	message string
}

func (m *messageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, m.message)
}

func messHandlerFunc(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "about.")
}

func iconHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./favicon.ico")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/favicon.ico", iconHandler)
	mux.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("public"))))

	mux.Handle("/welcome", &messageHandler{"Welcome to Go web development"})
	mux.Handle("/message", http.HandlerFunc(messHandlerFunc))
	mux.HandleFunc("/about", messHandlerFunc)

	server := &http.Server{
		Addr:    ":3000",
		Handler: mux,
	}
	log.Println("Listening...")
	// http.ListenAndServe(":3000", mux)
	server.ListenAndServe()
}
