package utils

import (
	"crypto/rsa"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
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
		log.Printf("[InitKeys]: %s\n", err)
	}
	signKey, err = jwt.ParseRSAPrivateKeyFromPEM(signByte)
	if err != nil {
		log.Printf("[InitKeys]: %s\n", err)
	}

	verifyByte, err = ioutil.ReadFile(publicKeyPath)
	if err != nil {
		log.Printf("[InitKeys]: %s\n", err)
	}
	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyByte)
	if err != nil {
		log.Printf("[InitKeys]: %s\n", err)
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
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(),
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
func Auth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authString := r.Header.Get("Authorization")
		if len(authString) < 8 {
			DisplayAppError(w, "Invalid Access Token", http.StatusUnauthorized)
			return
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
					DisplayAppError(w, "Token Expired", http.StatusUnauthorized)
					return
				default:
					DisplayAppError(w, "ValidationError", http.StatusUnauthorized)
					return
				}
			default:
				DisplayAppError(w, "ValidationError", http.StatusUnauthorized)
				return
			}
		}
		if token.Valid {
			var Username string
			if claims, ok := token.Claims.(*MyCustomClaims); ok {
				// fmt.Println(claims.Username)
				// fmt.Println(claims.StandardClaims.ExpiresAt)
				context.Set(r, Username, claims.Username)
				next(w, r)
			} else {
				DisplayAppError(w, "An unexpected error has occurred", http.StatusInternalServerError)
			}
		} else {
			DisplayAppError(w, "Invalid Access Token", http.StatusUnauthorized)
		}
	}

}
