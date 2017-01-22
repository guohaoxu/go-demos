package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

type Note struct {
	Title       string
	Description string
	Author      interface{}
	CreatedOn   time.Time
}

var noteStore = make(map[string]Note)
var id int = 0
var templates = make(map[string]*template.Template)
var store = sessions.NewCookieStore([]byte("somehashsaltsecret"))

func init() {
	templates["index"] = template.Must(template.ParseFiles("templates/index.html", "templates/base.html"))
	templates["add"] = template.Must(template.ParseFiles("templates/add.html", "templates/base.html"))
	templates["edit"] = template.Must(template.ParseFiles("templates/edit.html", "templates/base.html"))
	templates["login"] = template.Must(template.ParseFiles("templates/login.html", "templates/base.html"))
	templates["logup"] = template.Must(template.ParseFiles("templates/logup.html", "templates/base.html"))
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

func logup(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "logup", "base", nil)
}

func login(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "login", "base", nil)
}

func logout(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	session.Options = &sessions.Options{
		MaxAge: -1,
	}
	session.Save(r, w)
	fmt.Println("session:", session)
	http.Redirect(w, r, "/", 302)
}

func addUser(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostFormValue("username")
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	session.Values["username"] = username
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}

func getNotes(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	type indexData struct {
		Notes    map[string]Note
		Username interface{}
	}
	username := session.Values["username"]
	if username == nil {
		username = ""
	}
	indexdata := indexData{noteStore, username}
	renderTemplate(w, "index", "base", indexdata)
}

func addNote(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "add", "base", nil)
}

func saveNote(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	title := r.PostFormValue("title")
	description := r.PostFormValue("description")
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	note := Note{title, description, author, time.Now()}
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
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	if note, ok := noteStore[k]; ok {
		r.ParseForm()
		noteToUpd.Title = r.PostFormValue("title")
		noteToUpd.Description = r.PostFormValue("description")
		noteToUpd.Author = author
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

func iconHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public/favicon.ico")
}

func main() {
	logFile, err := os.OpenFile("server.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/favicon.ico", iconHandler)

	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", handlers.LoggingHandler(logFile, handlers.CompressHandler(http.FileServer(http.Dir("public"))))))

	logupHandler := http.HandlerFunc(logup)
	loginHandler := http.HandlerFunc(login)
	addUserHandler := http.HandlerFunc(addUser)
	getNotesHandler := http.HandlerFunc(getNotes)
	addNoteHandler := http.HandlerFunc(addNote)
	saveNoteHandler := http.HandlerFunc(saveNote)
	editNoteHandler := http.HandlerFunc(editNote)
	updateNoteHandler := http.HandlerFunc(updateNote)
	deleteNoteHandler := http.HandlerFunc(deleteNote)

	r.Handle("/logup", handlers.LoggingHandler(logFile, handlers.CompressHandler(logupHandler)))
	r.Handle("/login", handlers.LoggingHandler(logFile, handlers.CompressHandler(loginHandler)))

	r.Handle("/logout", http.HandlerFunc(logout))

	r.Handle("/users/add", handlers.LoggingHandler(logFile, handlers.CompressHandler(addUserHandler)))

	r.Handle("/", handlers.LoggingHandler(logFile, handlers.CompressHandler(getNotesHandler)))
	r.Handle("/notes/add", handlers.LoggingHandler(logFile, handlers.CompressHandler(addNoteHandler)))
	r.Handle("/notes/save", handlers.LoggingHandler(logFile, handlers.CompressHandler(saveNoteHandler)))
	r.Handle("/notes/edit/{id}", handlers.LoggingHandler(logFile, handlers.CompressHandler(editNoteHandler)))
	r.Handle("/notes/update/{id}", handlers.LoggingHandler(logFile, handlers.CompressHandler(updateNoteHandler)))
	r.Handle("/notes/delete/{id}", handlers.LoggingHandler(logFile, handlers.CompressHandler(deleteNoteHandler)))

	server := &http.Server{
		Addr:    ":3000",
		Handler: r,
	}
	log.Println("Listening on port 3000...")
	server.ListenAndServe()
}
