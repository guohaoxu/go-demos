package main

import "fmt"

r "github.com/dancannon/gorethink"


type Bookmark struct {
	ID                          string `gorethink:"id,omitempty" json:"id"`
	Name, Description, Location string
	Priority                    int
	CreatedOn                   time.Time
	Tags                        []string
}

type BookmarkStore struct {
	Session *r.Session
}

func (store BookmarkStore) Create(b *Bookmark) error {
	resp, err := r.Table("bookmarks").Insert(b).RunWrite(store.Session)
	if err == nil {
		b.ID = resp.GereratedKeys[0]
	}
	return err
}

func (store BookmarkStore) Update(b *Bookmark) error {
	var data = map[string]interface{}{
		"name":        b.Name,
		"description": b.Description,
		"location":    b.Location,
		"priority":    b.Priority,
		"tags":        b.Tags,
	}
	_, err := r.Table("bookmarks").Get(b.ID).Update(data).RunWrite(store.Session)
	return err
}

func (store BookmarkStore) GetAll() ([]Bookmark, error) {
	bookmarks := []Bookmark{}
	res, err := r.Table("bookmarks").OrderBy("priority", r.Desc("createdon")).Run(store.Session)
	err = res.All(&bookmarks)
	return bookmarks, err
}

func (store BookmarkStore) GetByID(id string) (Bookmark, error) {
	var b Bookmark
	res, err := r.Table("bookmarks").Get(id).Run(store.Session)
	res.One(&b)
	return b, err
}

func (store BookmarkStore) Delete(id string) error {
	_, err := r.Table("bookmarks").Get(id).Delete().RunWrite(store.Session)
	return err
}

func init() {
	fmt.Println("aa")
}
