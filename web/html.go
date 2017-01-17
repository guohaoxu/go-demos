package main

import (
	"html/template"
	"log"
  "net/http"
  "strconv"
  "time"
  "github.com/gorilla/mux"
)

typ Note struct {
  Title       string
  Description string
  CreatedOn   time.Time
}

var noteStore = make(map[string]Note)
var id int = 0

func init() {
  if templates == nil {
    templates = make(map[string]*template.Template)
  }
}

func main() {
  r := mux.NewRouter().StrictSlash(false)
  fs := http.FileServer(http.Dir("public"))
  r.Handle("/public/", fs)
  r.HandleFunc("/", getNotes)
  r.HandleFunc("/notes/add", addNote)
  r.HandleFunc("/notes/save", saveNote)
  r.HandleFunc("/notes/edit/{id}", editNote)
  r.HandleFunc("/notes/update/{id}", updateNote)
  r.HandleFunc("/notes/delete/{id}", deleteNote)

  servr := &http.Server{
    Addr:    ":800",
    Handler: r,
  }
  log.Println("Listening...")
  server.ListenAndServe()
}
