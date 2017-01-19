package main

import (
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Note struct {
	Title       string
	Description string
	CreatedOn   time.Time
}

var noteStore = make(map[string]Note)
var id int = 0
var templates = make(map[string]*template.Template)

func init() {
	templates["index"] = template.Must(template.ParseFiles("templates/index.html", "templates/base.html"))
}

func renderTemplate(w http.ResponseWriter, name string, template string, viewModel interface{}) {
	tmpl, ok := templates[name]
	if !ok {
		http.Error(w, "no template", http.StatusInternalServerError)
	}
	err := tmpl.ExecuteTemplate(w, template, viewModel)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func getNotes(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index", "base", noteStore)
}

func addNote(w http.ResponseWriter, r *http.Request) {
	//
}

func saveNote(w http.ResponseWriter, r *http.Request) {
	//
}

func editNote(w http.ResponseWriter, r *http.Request) {
	//
}

func updateNote(w http.ResponseWriter, r *http.Request) {
	//
}

func deleteNote(w http.ResponseWriter, r *http.Request) {
	//
}

type EditNote struct {
	Note
	Id string
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

	server := &http.Server{
		Addr:    ":8000",
		Handler: r,
	}
	log.Println("Listening on port 8000...")
	server.ListenAndServe()
}
