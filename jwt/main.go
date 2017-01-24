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
	t := jwt.New(jwt.GetSigningMethod("RS256"))
	jwt.MapClaims["iss"] = "admin"
	jwt.MapClaims["CustomUserInfo"] = struct {
		Name string
		Role string
	}{user.Username, "Member"}

	jwt.MapClaims["exp"] = time.Now().Add(time.Minute * 20).Unix()

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
	token, err := jwt.ParseFromRequest(r, func(token *jwt.Token) (interface{}, error) {
		return verifyKey, nil
	})
	if err != nil {
		switch err.(type) {
		case *jwt.ValidationError:
			vErr := err.(*jwt.ValidationError)
			switch vErr.Errors {
			case jwt.ValidationErrorExpired:
				w.WriteHeader(http.StatusUnauthorized)
				fmt.Fprintln(w, "Token Expired, get a new one.")
				return
			default:
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Error while Parsing Token!")
				log.Printf("ValidationError error: %+v\n", vErr.Errirs)
				return
			}
		default:
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error while Parsing Token!")
			log.Printf("Token parse error:%v\n", err)
			return
		}
	}
	if token.Valid {
		response := Response{"Authorized to the system"}
		jsonResponse(response, w)
	} else {
		response := Response{"Invalid token"}
		jsonResponse(response, w)
	}
}

type Response struct {
	Text string `json:"text"`
}
type Token struct {
	Token string `json:"token"`
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
		Addr:    ":8080",
		Handler: r,
	}
	log.Println("Listening...")
	server.ListenAndServe()
}
