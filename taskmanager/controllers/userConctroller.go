package controllers

import (
	"encoding/json"
	"go-demos/taskmanager/models"
	"net/http"
)

// POST /users/register
func Register(w http.ResponseWriter, r *http.Request) {
	var dataResource UserResource
	err := json.NewDecoder(r.Body).Decode(&dataResource)
	if err != nil {
		common.DisplayAppError(w, err, "Invalid User data", 500)
		return
	}
	user := &dataResource.Data
	context := NewContext()
	defer context.Close()
	c := context.DbCollection("users")
	repo := &data.UserRepository{c}
	repo.CreateUser(user)
	user.HashPwssword = nil
	if j, err := json.Marshal(UserResource{Data: *user}); err != nil {
		common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
		return
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(j)
	}
}

// POST /users/login
// {"data":{"email":"98609967@qq.com","password":"123456"}}
func Login(w http.ResponseWriter, r *http.Request) {
	var dataResource LoginResource
	var token string
	err := json.NewDecoder(r.Body).Decode(&dataResource)
	if err != nil {
		common.DisplayAppError(w, err, "Invalid Login data", 500)
		return
	}
	loginUser := models.User{
		Email:    dataResource.Data.Email,
		Password: dataResource.Data.Password,
	}
	context := NewContext()
	defer context.Close()
	c := context.DbCollection("users")
	repo := &data.UserRepository{c}

	// Auth the login user
	if user, err := repo.Login(loginUser); err != nil {
		common.DisplayAppError(w, err, "Invalid login credentials", 401)
		return
	} else {
		token, err = common.GenerateJWT(user.Email, "member")
		if err != nil {
			common.DisplayAppError(w, err, "Error while generating the access token", 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		user.HashPassword = nil
		authUser := AuthUserModel{
			User:  user,
			Token: token,
		}
		j, err := json.Marshal(AuthUserResource{Data: authUser})
		if err != nil {
			common.DisplayAppError(w, err, "An unexpected error has occurred", 500)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(j)
	}
}
