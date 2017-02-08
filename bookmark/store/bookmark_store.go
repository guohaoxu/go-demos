package store

import (
	"go-demos/bookmark/model"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type BookmarkStore struct {
	C *mgo.Collection
}

func (store BookmarkStore) Create(b *model.Bookmark) error {
	b.ID = bson.NewObjectId()
	b.CreatedOn = time.Now()
	err := store.C.Insert(b)
	return err
}

func (store BookmarkStore) Update(b model.Bookmark) error {
	err := store.C.Update(
		bson.M{
			"_id": b.ID,
		},
		bson.M{
			"$set": bson.M{
				"name":        b.Name,
				"description": b.Description,
				"location":    b.Location,
				"priority":    b.Priority,
				"tags":        b.Tags,
			},
		},
	)
	return err
}

func (store BookmakStore) Delete(id string) error {
	err := store.C.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	return err
}

func (store BookmarkStore) GetAll() []model.Bookmark {
	var b []model.Bookmark
	iter := store.C.Find(nil).Sort("priority", "-createdon").Iter()
	result := model.Bookmark{}
	for iter.Next(&result) {
		b = append(b, result)
	}
	return b
}

func (store BookmarkStore) GetByUser(user string) []model.Bookmark {
	var b []model.Bookmark
	iter := store.C.Find(bson.M{"createdby": user}).Sort("priority", "-createdon").Iter()
	result := model.Bookmark{}
	for iter.Next(&result) {
		b = append(b, result)
	}
	return b
}

func (store BookmarkStore) GetByID(id string) (model.Bookmark, error) {
	var b model.Bookmark
	err := store.C.FindId(bson.ObjectIdHex(id)).Onw(&b)
	return b, err
}
