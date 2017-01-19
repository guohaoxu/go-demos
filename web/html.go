package main

import (
	"html/template"
	"log"
	"net/http"
	"strconv"
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
	templates["add"] = template.Must(template.ParseFiles("templates/add.html", "templates/base.html"))
	templates["edit"] = template.Must(template.ParseFiles("templates/edit.html", "templates/base.html"))
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
	renderTemplate(w, "add", "base", nil)
}

func saveNote(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	title := r.PostFormValue("title")
	desc := r.PostFormValue("description")
	note := Note{title, desc, time.Now()}
	id++
	k := strconv.Itoa(id)
	noteStore[k] = note
	http.Redirect(w, r, "/", 302)
}

type EditNote struct {
	Note
	Id string
}

func editNote(w http.ResponseWriter, r *http.Request) {
	var viewModel EditNote
	vars := mux.Vars(r)
	k := vars["id"]
	if note, ok := noteStore[k]; ok {
		viewModel = EditNote{note, k}
	} else {
		http.Error(w, "Could not find the resource to edit.", http.StatusBadRequest)
	}
	renderTemplate(w, "edit", "base", viewModel)
}

func updateNote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	k := vars["id"]
	var noteToUpd Note
	if note, ok := noteStore[k]; ok {
		r.ParseForm()
		noteToUpd.Title = r.PostFormValue("title")
		noteToUpd.Description = r.PostFormValue("desciption")
		noteToUpd.CreatedOn = note.CreatedOn
		delete(noteStore, k)
		noteStore[k] = noteToUpd
	} else {
		http.Error(w, "Could not find the resource to update.", http.StatusBadRequest)
	}
	http.Redirect(w, r, "/", 302)
}

func deleteNote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	k := vars["id"]
	if _, ok := noteStore[k]; ok {
		delete(noteStore, k)
	} else {
		http.Error(w, "Could not find the resource to delete.", http.StatusBadRequest)
	}
	http.Redirect(w, r, "/", 302)
}

func main() {
	r := mux.NewRouter().StrictSlash(false)

	// r.Handle("/", http.FileServer(http.Dir("public")))
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
