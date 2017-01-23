package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

var session *mgo.Session

type User struct {
	Id       bson.ObjectId `bson:"_id,omitempty"`
	Username string
	Password string
}

type Note struct {
	Id          bson.ObjectId `bson:"_id,omitempty"`
	Title       string
	Description string
	Author      interface{}
	CreatedOn   time.Time
}

type DataStore struct {
	Session *mgo.Session
}

func (d *DataStore) Close() {
	d.Session.Close()
}

func (d *DataStore) C(name string) *mgo.Collection {
	return d.Session.DB("notedb").C(name)
}

func NewDataStore() *DataStore {
	ds := &DataStore{
		Session: session.Copy(),
	}
	return ds
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

// 注册页面
func logup(w http.ResponseWriter, r *http.Request) {
	var logupModel interface{}
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	if flashes := session.Flashes(); len(flashes) > 0 {
		logupModel = flashes[0]
	}
	session.Save(r, w)
	renderTemplate(w, "logup", "base", logupModel)
}

// 登录页面
func login(w http.ResponseWriter, r *http.Request) {
	var loginModel interface{}
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	if flashes := session.Flashes(); len(flashes) > 0 {
		loginModel = flashes[0]
	}
	session.Save(r, w)
	renderTemplate(w, "login", "base", loginModel)
}

// 退出账户
func logout(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	session.Options = &sessions.Options{
		MaxAge: -1,
	}
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}

// 注册新用户
func addUser(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := strings.TrimSpace(r.PostFormValue("username"))
	password := strings.TrimSpace(r.PostFormValue("password"))
	repPassword := strings.TrimSpace(r.PostFormValue("repPassword"))

	// 验证表单字段
	if username == "" || password == "" || password != repPassword {
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.AddFlash("用户名或密码错误！")
		session.Save(r, w)
		http.Redirect(w, r, "/logup", 302)
		return
	}

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("users")

	// 查询用户名是否已存在
	resultOne := User{}
	err := c.Find(bson.M{"username": username}).One(&resultOne)
	if err != nil {
		// 用户名不存在
		user := User{
			bson.NewObjectId(),
			username,
			password,
		}
		err := c.Insert(user)
		if err != nil {
			panic(err)
		}

		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.Values["username"] = username
		session.Save(r, w)
		http.Redirect(w, r, "/", 302)
	} else {
		// 用户名已存在
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.AddFlash("用户名已存在！")
		session.Save(r, w)
		http.Redirect(w, r, "/logup", 302)
	}

}

// 用户登录
func loginAuth(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := strings.TrimSpace(r.PostFormValue("username"))
	password := strings.TrimSpace(r.PostFormValue("password"))

	// 验证表单字段
	if username == "" || password == "" {
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.AddFlash("用户名或密码错误！")
		session.Save(r, w)
		http.Redirect(w, r, "/login", 302)
		return
	}

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("users")

	// 查询用户名
	resultOne := User{}
	err := c.Find(bson.M{"username": username}).One(&resultOne)
	if err != nil || resultOne.Password != password {
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.AddFlash("用户名或密码错误！")
		session.Save(r, w)
		http.Redirect(w, r, "/login", 302)
	} else {
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.Values["username"] = username
		session.Save(r, w)
		http.Redirect(w, r, "/", 302)
	}
}

// 首页 显示所有note
func getNotes(w http.ResponseWriter, r *http.Request) {
	var notes []Note

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("notes")
	iter := c.Find(nil).Iter()
	result := Note{}
	for iter.Next(&result) {
		notes = append(notes, result)
	}

	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	username := session.Values["username"]
	if username == nil {
		username = ""
	}

	type newNote struct {
		Uid         interface{}
		Title       string
		Description string
		Author      interface{}
		CreatedOn   time.Time
	}
	type indexData struct {
		Notes    []newNote
		Username interface{}
	}
	var newNotes []newNote
	for i := 0; i < len(notes); i++ {
		newNotes = append(newNotes, newNote{
			Uid:         notes[i].Id.Hex(),
			Title:       notes[i].Title,
			Description: notes[i].Description,
			Author:      notes[i].Author,
			CreatedOn:   notes[i].CreatedOn,
		})
	}
	indexdata := indexData{newNotes, username}
	renderTemplate(w, "index", "base", indexdata)
}

// 添加note页面
func addNote(w http.ResponseWriter, r *http.Request) {
	// 验证是否是已登录状态
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	if author == nil {
		http.Redirect(w, r, "/login", 302)
		return
	}

	var addNoteModel interface{}
	if flashes := session.Flashes(); len(flashes) > 0 {
		addNoteModel = flashes[0]
	}
	session.Save(r, w)
	renderTemplate(w, "add", "base", addNoteModel)
}

// 添加note
func saveNote(w http.ResponseWriter, r *http.Request) {
	// 验证是否是已登录状态
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	if author == nil {
		http.Redirect(w, r, "/login", 302)
		return
	}

	r.ParseForm()
	title := strings.TrimSpace(r.PostFormValue("title"))
	description := strings.TrimSpace(r.PostFormValue("description"))

	// 验证表单字段
	if title == "" || description == "" {
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.AddFlash("标题或描述为空！")
		session.Save(r, w)
		http.Redirect(w, r, "/notes/add", 302)
		return
	}

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("notes")

	note := Note{
		bson.NewObjectId(),
		title,
		description,
		author,
		time.Now(),
	}
	err = c.Insert(note)
	if err != nil {
		panic(err)
	}

	http.Redirect(w, r, "/", 302)
}

// 编辑note页面
func editNote(w http.ResponseWriter, r *http.Request) {
	// 验证是否是已登录状态
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	if author == nil {
		http.Redirect(w, r, "/login", 302)
		return
	}

	r.ParseForm()
	vars := mux.Vars(r)
	id := vars["id"]
	objectId := bson.ObjectIdHex(id)

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("notes")

	resultOne := Note{}
	err = c.Find(bson.M{"_id": objectId}).One(&resultOne)
	if err != nil {
		panic(err)
	}

	if author != resultOne.Author {
		http.Redirect(w, r, "/login", 302)
		return
	}

	type editType struct {
		Uid            interface{}
		Title          string
		Description    string
		EditFlashModel interface{}
	}

	var editFlashModel interface{}
	if flashes := session.Flashes(); len(flashes) > 0 {
		editFlashModel = flashes[0]
	}
	session.Save(r, w)

	var editModel = editType{
		Uid:            id,
		Title:          resultOne.Title,
		Description:    resultOne.Description,
		EditFlashModel: editFlashModel,
	}
	renderTemplate(w, "edit", "base", editModel)
}

func updateNote(w http.ResponseWriter, r *http.Request) {
	// 验证是否是已登录状态
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	if author == nil {
		http.Redirect(w, r, "/login", 302)
		return
	}

	r.ParseForm()
	title := strings.TrimSpace(r.PostFormValue("title"))
	description := strings.TrimSpace(r.PostFormValue("description"))
	vars := mux.Vars(r)
	id := vars["id"]
	objectId := bson.ObjectIdHex(id)

	// 验证表单字段
	if title == "" || description == "" {
		session, err := store.Get(r, "sessionId")
		if err != nil {
			panic(err)
		}
		session.AddFlash("标题或描述为空！")
		session.Save(r, w)
		http.Redirect(w, r, "/notes/edit/"+id, 302)
		return
	}

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("notes")

	resultOne := Note{}
	err = c.Find(bson.M{"_id": objectId}).One(&resultOne)
	if err != nil {
		panic(err)
	}

	if author != resultOne.Author {
		http.Redirect(w, r, "/login", 302)
		return
	}

	err = c.Update(bson.M{"_id": objectId}, bson.M{"$set": bson.M{
		"title":       title,
		"description": description,
	}})
	if err != nil {
		panic(err)
	}

	http.Redirect(w, r, "/", 302)
}

func deleteNote(w http.ResponseWriter, r *http.Request) {
	// 验证是否是已登录状态
	session, err := store.Get(r, "sessionId")
	if err != nil {
		panic(err)
	}
	author := session.Values["username"]
	if author == nil {
		http.Redirect(w, r, "/login", 302)
		return
	}

	r.ParseForm()
	vars := mux.Vars(r)
	id := vars["id"]
	objectId := bson.ObjectIdHex(id)

	ds := NewDataStore()
	defer ds.Close()
	c := ds.C("notes")

	err = c.Remove(bson.M{"_id": objectId})
	if err != nil {
		panic(err)
	}

	http.Redirect(w, r, "/", 302)
}

func iconHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public/favicon.ico")
}

func main() {
	// connect Database
	var err error
	session, err = mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}

	logFile, err := os.OpenFile("server.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/favicon.ico", iconHandler)

	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", handlers.LoggingHandler(logFile, handlers.CompressHandler(http.FileServer(http.Dir("public"))))))

	logupHandler := http.HandlerFunc(logup)
	loginHandler := http.HandlerFunc(login)
	loginAuthHandler := http.HandlerFunc(loginAuth)
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
	r.Handle("/users/auth", handlers.LoggingHandler(logFile, handlers.CompressHandler(loginAuthHandler)))

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
