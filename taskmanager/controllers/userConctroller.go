package controllers

import (
	"encoding/json"
	"go-demos/taskmanager/models"
	"go-demos/taskmanager/utils"
	"net/http"
)

// POST /users/register
// {"username":"admin","email":"986099670@qq.com","password":"123456"}
func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		utils.DisplayAppError(w, err, "Invalid User data", 400)
		return
	}

	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("users")
	userModel := &models.UserModel{c}
	u, err := userModel.CreateUser(user)
	if err != nil {
		utils.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	u.HashPassword = nil
	j, err := json.Marshal(u)
	if err != nil {
		utils.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(j)
	}
}

type AuthUserModel struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}

// POST /users/login
// {"username":"admin","password":"123456"}
func Login(w http.ResponseWriter, r *http.Request) {
	var loginModel models.User
	err := json.NewDecoder(r.Body).Decode(&loginModel)
	if err != nil {
		utils.DisplayAppError(w, err, "Invalid Login data", 400)
		return
	}

	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("users")
	userModel := &models.UserModel{c}

	// Auth the login user
	user, err := userModel.Login(loginModel)
	if err != nil {
		utils.DisplayAppError(w, err, "Invalid login credentials", 401)
		return
	}

	tokenString, err := utils.GenerateJWT(user.Username)
	if err != nil {
		utils.DisplayAppError(w, err, "Error while generating the access token", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	user.HashPassword = nil
	authUser := AuthUserModel{
		User:  user,
		Token: tokenString,
	}
	j, err := json.Marshal(authUser)
	if err != nil {
		utils.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}
