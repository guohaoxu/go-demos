package controllers

import "go-demos/taskmanager/models"

type (
	// POST /user/register
	UserResource struct {
		Data models.User `json:"data"`
	}

	// Model for auth
	LoginModel struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	// POST /user/login
	LoginResource struct {
		Data LoginModel `json:"data"`
	}

	// Model for auth user access token
	AuthUserModel struct {
		User  models.User `json:"user"`
		Token string      `json:"token"`
	}
	// Response POST /user/Login
	AuthUserResource struct {
		Data AuthUserModel `json:"data"`
	}

	// GET /tasks/id
	TaskResource struct {
		Data models.Task `json:"data"`
	}
	// GET /tasks
	TasksResource struct {
		Data []models.Task `json:"data"`
	}
)
