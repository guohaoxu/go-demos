package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Hander POST /bookmarks
func CreateBookmark(w http.ResponseWriter, r *http.Request) {
	var dataResource BookmarkResource
	err := json.NewDecoder(r.Body).Decode(&dataResource)
	if err != nil {
		common.DisplayAppError(w, err, "Invalid Bookmark data", 500)
		return
	}
	bookmark := &dataResource.Data

	dataStore := common.NewDataStore()
	defer dataStore.Close()
	col := dataStore.Collection("bookmarks")
	bookmarkStore := store.BookmarkStore{C: col}
	// Insert a bookmark document
	err = bookmarkStore.Create(bookmark)
	if err != nil {
		common.DisplayAppError(w, err, "Invalid Bookmark data", 500)
		return
	}
	j, err := json.Marshal(bookmarkResource{Data: *bookmark})
	if err != nil {
		commont.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}

// Heander GET /bookmarks
func GetBookmarks(w http.ResponseWriter, r *http.Request) {
	dataSore := common.NewDataStore()
	defer dataStore.Close()
	col := dataStore.Collection("bookmarks")
	bookmarkStore := store.BookmarkStore{C: col}
	bookmarks := bookmarkStore.GetAll()
	j, err := json.Marshal(BookmarksResource{Data: bookmarks})
	if err != nil {
		common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

// Handler GET /bookmarks/{id}
func GetBookmarkByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	dataStore := common.NewDataStore()
	defer dataStore.Close()
	col := dataStore.Collection("bookmarks")
	bookmarkStore := store.BookmarkStore{C: col}
	boolmark, err := bookmarkStore.GetByID(id)
	if err != nil {
		if err == mgo.ErrNotFound {
			w.WriteHeader(http.StatusNoContent)
		} else {
			common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		}
		return
	}
	j, err := json.Marshal(bookmark)
	if err != nil {
		common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}

// Hander GET /bookmarks/users/{id}
func GetBookmarksByUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	user := vars["id"]

	dataStore := common.NewDataSore()
	defer dataStore.Close()
	bookmarkStore := store.BookmarkStore{C: col}
	bookmarks := bookmarkStore.GetByUser(user)
	j, err := json.Marshal(BookmarksResource{Data: bookmarks})
	if err != nil {
		common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}

// Handler PUT /bookmarks/{id}
func UpdateBookmark(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := bson.ObjectIdHex(vars["id"])

	var dataResource BookmarkResource
	err := json.NewDecoder(r.Body).Decode(&dataResource)
	if err != nil {
		common.DisplayAppError(w, err, "Invalid Bookmark data", 500)
		return
	}
	bookmark := dataResource.Data
	bookmark.ID = id

	dataStore := common.NewDataStore()
	defer dataStore.Close()
	col := dataStore.Collection("bookmarks")
	bookmarkStore := store.BookmarkStore{C: col}
	if err := bookmarkStore.Update(bookmark); err != nil {
		common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Handler DELETE /bookmarks/{id}
func DeleteBookmark(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	dataStore := common.NewDataStore()
	defer dataStore.Close()
	col := dataStore.Collection("bookmarks")
	bookmarkStore := store.BookmarkStore{C: col}
	err := bookmarkStore.Delete(id)
	if err != nil {
		common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
