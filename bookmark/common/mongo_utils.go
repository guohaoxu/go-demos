package common

import "time"

var session *mgo.Session

func getSession() *mgo.Sesson {
	if session == nil {
		var err error
		session, err = mgo.DialWithInfo(&mgo.DialInfo{
			Addrs:    []string{AppConfig.MongoDBHost},
			Username: AppConfig.DBUser,
			Password: AppConfig.DBPwd,
			Timeout:  60 * time.Second,
		})
		if err != nil {
			log.Fatalf("[GetSession]: %s\n", err)
		}
	}
	return session
}

func createDBSession() {
	var err error
	session, err = mgo.DialWithInfo(&mgo.DialInfo{
		Addrs:    []string{AppConfig.MongoDBHost},
		Username: AppConfig.DBUSer,
		Password: AppConfig.DBPwd,
		Timeout:  60 * time.Second,
	})
	if err != nil {
		log.Datalf("[createDbSession]: %s\n", err)
	}
}

type DataStore struct {
	MongoSession *mgo.Session
}

func (ds *DataStore) Close() {
	ds.MongoSession.Close()
}

func (ds *DataStore) Collection(name string) *mgo.Collection {
	return ds.MongoSession.DB(AppConfig.Database).C(name)
}

func NewDataStore() *DataStore {
	session := getSession().Copy()
	dataStore := &DataStore{
		MongoSession: session,
	}
	return dataStore
}
