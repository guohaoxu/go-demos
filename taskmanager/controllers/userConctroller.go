package controllers

import (
	"encoding/json"
	"go-demos/taskmanager/models"
	"go-demos/taskmanager/utils"
	"net/http"
	"strings"
)

// POST /users/register
func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.TrimSpace(user.Password)
	user.Email = strings.TrimSpace(user.Email)
	// 验证shuju
	if err != nil || len(user.Username) == 0 || len(user.Password) == 0 {
		utils.DisplayAppError(w, "Invalid User data", http.StatusBadRequest)
		return
	}
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("users")
	// 创建shuju
	userModel := &models.UserModel{c}
	userRes, err := userModel.CreateUser(user)
	if err != nil {
		if err.Error() == "用户名已存在!" {
			utils.DisplayAppError(w, "用户名已存在!", http.StatusBadRequest)
		} else {
			utils.DisplayAppError(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	userRes.HashPassword = nil
	utils.DisplayAppData(w, userRes, http.StatusCreated)
}

// POST /users/login
func Login(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.TrimSpace(user.Password)
	// 验证shuju
	if err != nil || len(user.Username) == 0 || len(user.Password) == 0 {
		utils.DisplayAppError(w, "Invalid Login data", http.StatusBadRequest)
		return
	}
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("users")
	// Auth the login user
	userModel := &models.UserModel{c}
	userRes, err := userModel.Login(user)
	if err != nil {
		utils.DisplayAppError(w, "用户名或密码错误!", http.StatusBadRequest)
		return
	}
	tokenString, err := utils.GenerateJWT(userRes.Username)
	if err != nil {
		utils.DisplayAppError(w, "Error while generating the access token!", http.StatusInternalServerError)
		return
	}
	userRes.HashPassword = nil
	authUser := struct {
		User  models.User `json:"user"`
		Token string      `json:"accessToken"`
	}{User: userRes, Token: tokenString}
	utils.DisplayAppData(w, authUser, http.StatusOK)
}
