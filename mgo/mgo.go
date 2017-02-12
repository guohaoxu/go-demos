package main

import (
	"fmt"
	"log"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Category struct {
	Id          bson.ObjectId `bson:"_id,omitempty"`
	Name        string
	Description string
}

func main() {
	//session, err := mgo.Dial("localhost")
	mgoDialInfo := &mgo.DialInfo{
		Addrs:    []string{"localhost"},
		Timeout:  60 * time.Second,
		Database: "taskdb",
		// Username: "user",
		// Password: "pass",
	}
	session, err := mgo.DialWithInfo(mgoDialInfo)
	if err != nil {
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	c := session.DB("taskdb").C("categories")

	// Insert----------------------------------
	doc := Category{
		bson.NewObjectId(),
		"Open Source",
		"Task for open-source projects",
	}
	err = c.Insert(&doc)
	if err != nil {
		log.Print(err)
	}
	err = c.Insert(&Category{
		bson.NewObjectId(), "R & D", "R & D Tasks"}, &Category{bson.NewObjectId(), "Project", "Project Tasks"})
	docM := map[string]string{
		"name":        "Open Source",
		"description": "Tasks for open source pojects",
	}
	err = c.Insert(docM)
	if err != nil {
		panic(err)
	}
	docD := bson.D{
		{"name", "Projectsssssssss"},
		{"description", "Project Tasksssssssssss"},
	}
	err = c.Insert(docD)
	if err != nil {
		log.Print(err)
	}
	count, err := c.Count()
	if err != nil {
		log.Print(err)
	} else {
		fmt.Printf("%d records inserted", count)
	}
	// Retrieving all records----------------------------------
	iter := c.Find(nil).Sort("name").Iter()
	result := Category{}
	for iter.Next(&result) {
		fmt.Printf("Category:%s, Description:%s\n", result.Name, result.Description)
	}
	if err = iter.Close(); err != nil {
		log.Print(err)
	}
	// Retrieving a single record----------------------------------
	result_one := Category{}
	err = c.Find(bson.M{"name": "Open Source"}).One(&result_one)
	if err != nil {
		log.Print(err)
	}
	fmt.Printf("Category%s, Description:%s\n", result_one.Name, result_one.Description)
	// Updateing Dpcuments----------------------------------
	id := 222222
	err = c.Update(bson.M{"_id": id}, bson.M{"$set": bson.M{
		"desciption": "Updating open source projects",
	}})
	if err != nil {
		log.Print(err)
	}
	// Deleting Dpcuments----------------------------------
	err = c.Remove(bson.M{"_id": id})
	if err != nil {
		log.Print(err)
	}
	c.RemoveAll(nil)
	// Indexes----------------------------------
	index := mgo.Index{
		Key:        []string{"name"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err = c.EnsureIndex(index)
	if err != nil {
		panic(err)
	}
}
