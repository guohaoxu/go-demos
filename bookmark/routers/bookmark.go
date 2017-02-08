package routers

import "github.com/gorilla/mux"

func SetBookmarkRoutes(router *mux.Router) *mux.Router {
	router.HandleFunc("/bookmarks", controllers.CreateBookmark).Method("POST")
	router.HandleFunc("/bookmarks/{id}", controllers.UpdateBookmark).Method("PUT")
	router.HandleFunc("/bookmarks", controllers.GetBookmarks).Method("GET")
	router.HandleFunc("/bookmarks/{id}", controllers.GetBookmarkByID).Method("GET")
	router.HandleFunc("/bookmarks/users/{id}", controllers.GetBookmarkByUser).Method("GET")
	router.HandleFunc("/bookmarks", controllers.DeleteBookmark).Method("DELETE")
}
