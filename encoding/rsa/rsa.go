package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"io/ioutil"
)

func main() {
	privKeyFile := "./private.rsa"
	pubKeyFile := "./public.rsa"

	privateKey, _ := rsa.GenerateKey(rand.Reader, 1024)

	// extract private and public keys from RSA keys
	privASN1 := x509.MarshalPKCS1PrivateKey(privateKey)
	pubASN1, _ := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)

	// store private and public keys into files
	privBytes := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: privASN1,
	})
	pubBytes := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PUBLIC KEY",
		Bytes: pubASN1,
	})
	ioutil.WriteFile(privKeyFile, privBytes, 0644)
	ioutil.WriteFile(pubKeyFile, pubBytes, 0644)
	fmt.Println("Done")
}
