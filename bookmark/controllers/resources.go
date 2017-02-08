package controllers

import "go-demos/bookmark/model"

type (
	// for GET /bookmarks/id
	BookmarkResource struct {
		Data model.Bookmark `json:"data"`
	}
	// for GET /bookmarks
	BookmarskResource struct {
		Data []model.Bookmark `json:"data"`
	}
)
