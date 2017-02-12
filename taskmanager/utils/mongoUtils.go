package utils

import (
	"log"
	"time"

	mgo "gopkg.in/mgo.v2"
)

var session *mgo.Session

func CreateDbSession() {
	var err error
	session, err = mgo.DialWithInfo(&mgo.DialInfo{
		Addrs:    []string{AppConfig.MongoDBHost},
		Username: AppConfig.DBUser,
		Password: AppConfig.DBPwd,
		Timeout:  60 * time.Second,
	})
	if err != nil {
		log.Printf("[CreteDbSession]: %s\n", err)
	}
}

func GetSession() *mgo.Session {
	if session == nil {
		CreateDbSession()
	}
	return session
}

func AddIndexes() {
	var err error
	userIndex := mgo.Index{
		Key:        []string{"username"},
		Unique:     true,
		Background: true,
		Sparse:     true,
	}
	taskIndex := mgo.Index{
		Key:        []string{"createdby"},
		Unique:     false,
		Background: true,
		Sparse:     true,
	}

	session := GetSession().Copy()
	defer session.Close()
	userCol := session.DB(AppConfig.Database).C("users")
	taskCol := session.DB(AppConfig.Database).C("tasks")
	err = userCol.EnsureIndex(userIndex)
	if err != nil {
		log.Printf("[AddIndexes]: %s\n", err)
	}
	err = taskCol.EnsureIndex(taskIndex)
	if err != nil {
		log.Printf("[AddIndexes]: %s\n", err)
	}
}
