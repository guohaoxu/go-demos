package controllers

import (
	"encoding/json"
	"go-demos/taskmanager/models"
	"go-demos/taskmanager/utils"
	"net/http"
	"strings"
)

// POST /users/register
// {"username":"admin","email":"986099670@qq.com","password":"123456"}
func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil || len(strings.TrimSpace(user.Username)) == 0 || len(strings.TrimSpace(user.Password)) == 0 {
		// utils.DisplayAppError(w, err, "Invalid User data", 400)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		j, _ := json.Marshal(struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{0, "Invalid User data！"})
		w.Write(j)
		return
	}
	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.TrimSpace(user.Password)
	user.Email = strings.TrimSpace(user.Email)

	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("users")
	userModel := &models.UserModel{c}
	u, err := userModel.CreateUser(user)
	if err != nil {
		// utils.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		j, _ := json.Marshal(struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{0, err.Error()})
		w.Write(j)
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
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil || len(strings.TrimSpace(user.Username)) == 0 || len(strings.TrimSpace(user.Password)) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		j, _ := json.Marshal(struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{0, "Invalid Login data！"})
		w.Write(j)
		return
	}

	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.TrimSpace(user.Password)

	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("users")
	userModel := &models.UserModel{c}

	// Auth the login user
	user2, err := userModel.Login(user)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		j, _ := json.Marshal(struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{0, "用户名或密码错误！"})
		w.Write(j)
		return
	}

	tokenString, err := utils.GenerateJWT(user2.Username)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		j, _ := json.Marshal(struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{0, "Error while generating the access token！"})
		w.Write(j)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	user2.HashPassword = nil
	authUser := AuthUserModel{
		User:  user2,
		Token: tokenString,
	}
	j, err := json.Marshal(authUser)
	if err != nil {
		// utils.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		j, _ := json.Marshal(struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{0, "An unexpected error has occurred！"})
		w.Write(j)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}
