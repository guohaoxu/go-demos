package model

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Bookmark struct {
	ID          bson.ObjectId `bson:"_id,omitempty"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Location    string        `json:"location"`
	Priority    int           `json:"priority"`
	CreatedBy   string        `json:"createdby"`
	CreatedOn   time.Time     `json:"createdon,ompiempty"`
	Tags        []string      `json:"tags,omitempty"`
}
