package utils

import (
	"encoding/json"
	"log"
	"os"
)

type configuration struct {
	Server, MongoDBHost, DBUser, DBPwd, Database string
}

var AppConfig configuration

func InitConfig() {
	file, err := os.Open("utils/config.json")
	defer file.Close()
	if err != nil {
		log.Fatalf("[InitConfig]: %s\n", err)
	}
	AppConfig = configuration{}
	err = json.NewDecoder(file).Decode(&AppConfig)
	if err != nil {
		log.Fatalf("[InitConfig]: %s\n", err)
	}
}
