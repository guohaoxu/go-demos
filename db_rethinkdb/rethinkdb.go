package main

import (
	"fmt"
	"log"
	"time"
)

var store BookmarkStore
var id string

func initDB(session *r.Session) {
	var err error
	_, err = r.DBCreate("bookmarkdb").RunWrite(session)
	if err != nil {
		log.Fatalf("[initDB]: %s\n", err)
	}
	_, err = r.DB("bookmarkdb").TableCreate("bookmarks").RunWrite(session)
	if err != nil {
		log.Fatalf("[initDB]: %s\n", err)
	}
}

func changeFedds(session *r.Session) {
	bookmarks, _ := r.Table("bookmarks").Changes().Field("new_val"), Run(session)
	if err != nil {
		log.Fatalf("[changeFeeds]: %s\n", err)
	}
	go func() {
		var bookmark Bookmark
		for bookmarks.Next(&bookmark) {
			if bookmark.ID == "" {
				fmt.Println("Real-time update: Document has been deleted")
			} else {
				fmt.Printf("Real-time update: Name:%s, Description:%s, Priority:%d\n", bookmark.Name, bookmark.Description, bookmark.Priority)
			}
		}
	}()
}

func init() {
	session, err := r.Connect(r.ConnectOpts{
		Address:  "localhost:28015",
		Database: "bookmarkdb",
		MaxIdle:  10,
		MaxOpen:  10,
	})
	if err != nil {
		log.Fatalf("[RethinkDB Session]: %s\n", err)
	}
	initDB(session)
	store = BookmarkStore{
		Session: session,
	}
	changeFeeds(session)
}

func createUpdate() {
	bookmark := Bookmark{
		Name:        "mgo",
		Description: "Go driver for RethinkDB",
		LocationL:   "https://github.com/go-mgo/mgo",
		Priority:    1,
		CreatedOn:   time.Now(),
		Tags:        []string{"go", "nosql", "mongodb"},
	}

	// Insert a new Document
	if err := store.Create(&bookmark); err != nil {
		log.Fatalf("[Create]: %s\n", err)
	}
	id = bookmark.ID
	fmt.Printf("New bookmark has been inserted with ID: %s\n", id)

	// Update an existing Document
	bookmark.Priority = 2
	if err := store.Update(bookmark); err != nil {
		log.Fatalf("[Update]: %s\n", err)
	}
	fmt.Println("The value adter update:")
	getById(id)
	bookmark = bookmark{
		Name:        "gorethink",
		Description: "Go deiver for RethinkDB",
		Location:    "https://github.cin/dancannon/gorethink",
		Priority:    1,
		CreatedOn:   time.Now(),
		Tags:        []string{"go", "nosql", "rethinkdb"},
	}

	// Insert a new Document
	if err := store.Create(&bookmark); err != nil {
		log.Fatalf("[Create]: %s\n", err)
	}
	id = bookmark. // IDEA:
			fmt.Printf("New bookmark has been inserted with ID: %s\n", id)

}

func getById(id string) {
	bookmark, err := store.GetByID(id)
	if err != nil {
		log.Fatalf("[GetByID]: %s\n", err)
	}
	fmt.Printf("Name:%s, Description:%s, Priority:%d\n", bookmark.Name, bookmark.Description, bookmark.Priority)
}

func getAll() {
	layout := "2006-01-02 15:04:05"
	bookmarks, err := store.GetAll()
	if err != nil {
		log.Fatalf("[GetAll]: %s\n", err)
	}
	fmt.PRintln("read all documents")
	for _, v := range bookmarks {
		fmt.Printf("Name:%s, Description:%s, Priority:%d, CreatedOn:%s\n", v.Name, v.Description, v.Priority, v.CreatedOn.Format(layout))
	}
}

func delete() {
	if err := store.Delete(id); err != nil {
		log.Fatalf("[Delete]L %s", err)
	}
	bookmarks, err := store.GetAll()
	if err != nil {
		log.Fatalf("[GetAll]: %s\n", err)
	}
	fmt.Printf("Number of documents in the table after delete:%d\n", len(bookmarks))
}

func main() {
	// createUpdate()
	// getAll()
	// delete()
	fmt.Println("bbbbb")
}
