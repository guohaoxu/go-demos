package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

/**
 * Generate RSA keys
 * openssl genrsa -out app.rsa 1024
 * openssl rsa -in app.rsa -pubout > app.rsa.pub
 */
const (
	privKeyPath = "keys/app.rsa"
	pubKeyPath  = "keys/app.rsa.pub"
)

var verifyKey, signKey []byte

var verifyKey2, signKey2 interface{}

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type Response struct {
	Text string `json:"text"`
}
type Token struct {
	Token string `json:"token"`
}
type MyCustomClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func init() {
	var err error
	signKey, err = ioutil.ReadFile(privKeyPath)
	if err != nil {
		log.Fatal("Error reading private key")
		return
	}
	signKey2, err = jwt.ParseRSAPrivateKeyFromPEM(signKey)
	if err != nil {
		panic(err)
	}
	verifyKey, err = ioutil.ReadFile(pubKeyPath)
	if err != nil {
		log.Fatal("Error reading private2 key")
		return
	}
	verifyKey2, err = jwt.ParseRSAPublicKeyFromPEM(verifyKey)
	if err != nil {
		panic(err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, "Error in request body")
		return
	}
	if user.Username != "admin" || user.Password != "123456" {
		w.WriteHeader(http.StatusForbidden)
		fmt.Fprint(w, "用户名或密码错误！")
		return
	}
	claims := MyCustomClaims{
		user.Username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute).Unix(),
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	tokenString, err := t.SignedString(signKey2)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, "Sorry, error while Signing Token!")
		log.Printf("Token Signing error: %v\n", err)
		return
	}
	response := Token{tokenString}
	jsonResponse(response, w)
}

func authHandler(w http.ResponseWriter, r *http.Request) {
	// Authorization Bearer AccessToken
	authString := r.Header.Get("Authorization")
	if len(authString) < 8 {
		response := Response{"Invalid token"}
		jsonResponse(response, w)
		return
	}
	tokenString := authString[7:len(authString)]
	t, err := jwt.ParseWithClaims(tokenString, &MyCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return verifyKey2, nil
	})

	if err != nil {
		switch err.(type) {
		case *jwt.ValidationError:
			fmt.Println(err)
			ve := err.(*jwt.ValidationError)
			switch ve.Errors {
			case jwt.ValidationErrorExpired:
				w.WriteHeader(http.StatusUnauthorized)
				fmt.Fprintln(w, "Token Expired, get a new one.")
				return
			default:
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintln(w, "ValidationError!")
				return
			}
		default:
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintln(w, "Error while Parsing Token!")
			return
		}
	}

	if t.Valid {
		if claims, ok := t.Claims.(*MyCustomClaims); ok {
			fmt.Println(claims.Username)
			fmt.Println(claims.StandardClaims.ExpiresAt)
			response := Response{"Authorized to the system"}
			jsonResponse(response, w)
		}
	} else {
		response := Response{"Invalid token"}
		jsonResponse(response, w)
	}

}

func jsonResponse(response interface{}, w http.ResponseWriter) {
	json, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/login", loginHandler).Methods("POST")
	r.HandleFunc("/auth", authHandler).Methods("POST")
	server := &http.Server{
		Addr:    ":8000",
		Handler: r,
	}
	log.Println("Listening...")
	server.ListenAndServe()
}
