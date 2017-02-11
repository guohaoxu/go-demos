package utils

import (
	"crypto/rsa"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

const (
	privateKeyPath = "keys/app.rsa"
	publicKeyPath  = "keys/app.rsa.pub"
)

var (
	signByte, verifyByte []byte
	signKey              *rsa.PrivateKey
	verifyKey            *rsa.PublicKey
)

func InitKeys() {
	var err error
	signByte, err = ioutil.ReadFile(privateKeyPath)
	if err != nil {
		log.Fatalf("[InitKeys]: %s\n", err)
	}
	signKey, err = jwt.ParseRSAPrivateKeyFromPEM(signByte)
	if err != nil {
		log.Fatalf("[InitKeys]: %s\n", err)
	}

	verifyByte, err = ioutil.ReadFile(publicKeyPath)
	if err != nil {
		log.Fatalf("[InitKeys]: %s\n", err)
	}
	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyByte)
	if err != nil {
		log.Fatalf("[InitKeys]: %s\n", err)
	}
}

// Generate JWT token
type MyCustomClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func GenerateJWT(username string) (string, error) {
	claims := MyCustomClaims{
		username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	tokenString, err := token.SignedString(signKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Middleware for validating JWT token
func Auth(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	authString := r.Header.Get("Authorization")
	if len(authString) < 8 {
		DisplayAppError(w, errors.New(""), "Invalid Access Token", 401)
	}
	tokenString := authString[7:len(authString)]
	token, err := jwt.ParseWithClaims(tokenString, &MyCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return verifyKey, nil
	})
	if err != nil {
		switch err.(type) {
		case *jwt.ValidationError:
			ve := err.(*jwt.ValidationError)
			switch ve.Errors {
			case jwt.ValidationErrorExpired:
				DisplayAppError(w, err, "Token Expired", 401)
				return
			default:
				DisplayAppError(w, err, "ValidationError", 500)
				return
			}
		default:
			DisplayAppError(w, err, "ValidationError", 500)
			return
		}
	}
	if token.Valid {
		next(w, r)
	} else {
		DisplayAppError(w, err, "Invalid Access Token", 401)
	}
}
