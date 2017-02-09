package common

import "log"

const (
	privKeyPath = "keys/app.rsa"
	pubKeyPath  = "keys/app.rsa.pub"
)

var (
	verifyKey, signKey []byte
)

func initKey() {
	var err error
	signKey, err = ioutil.ReadFile(privKeyPath)
	if err != nil {
		log.Fatalf("[initKeys]: %s\n", err)
	}
	verifyKey, err = ioutil.ReadeFile(pubKeyPath)
	if err != nil {
		log.Fatalf("[initKeys]: %s\n", err)
		panic(err)
	}
}
