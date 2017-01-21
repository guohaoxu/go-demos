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

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("public")))
	mux.Handle("/welcome", &messageHandler{"Welcome to Go web development"})
	mux.Handle("/message", http.HandlerFunc(messHandlerFunc))
	mux.HandleFunc("/about", messHandlerFunc)

	log.Println("Listening...")
	http.ListenAndServe(":3000", mux)
}
