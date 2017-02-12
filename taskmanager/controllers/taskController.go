package controllers

import (
	"encoding/json"
	"go-demos/taskmanager/models"
	"go-demos/taskmanager/utils"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/gorilla/mux"
)

// GET /tasks
func GetTasks(w http.ResponseWriter, r *http.Request) {
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("tasks")
	// 创建shuju
	taskModel := &models.TaskModel{c}
	tasks := taskModel.GetAll()
	utils.DisplayAppData(w, tasks, http.StatusOK)
}

// POST /tasks
func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		utils.DisplayAppError(w, "Invalid Task data", http.StatusInternalServerError)
		return
	}
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("tasks")
	//
	taskModel := &models.TaskModel{c}
	err = taskModel.Create(&task)
	if err != nil {
		utils.DisplayAppError(w, "An unexpected error has occurred", http.StatusInternalServerError)
		return
	}
	utils.DisplayAppData(w, task, http.StatusCreated)
}

// GET /tasks/{id}
func GetTaskById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("tasks")
	//
	taskModel := &models.TaskModel{c}
	taskRes, err := taskModel.GetTaskById(id)
	if err != nil {
		utils.DisplayAppError(w, "No data!", http.StatusBadRequest)
		return
	}
	utils.DisplayAppData(w, taskRes, http.StatusOK)
}

// PUT /tasks/{id}
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := bson.ObjectIdHex(vars["id"])

	var task models.Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		utils.DisplayAppError(w, "Invalid Task data", http.StatusInternalServerError)
		return
	}
	task.Id = id
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("tasks")
	//
	taskModel := &models.TaskModel{c}
	err = taskModel.Update(&task)
	if err != nil {
		utils.DisplayAppError(w, "An unexpected error has occurred", http.StatusInternalServerError)
		return
	}
	utils.DisplayAppData(w, task, http.StatusOK)
}

// DELETE /tasks/{id}
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("tasks")
	//
	taskModel := &models.TaskModel{c}
	err := taskModel.DeleteTask(id)
	if err != nil {
		if err.Error() == "error id" {
			utils.DisplayAppError(w, "error id", http.StatusBadRequest)
			return
		} else {
			utils.DisplayAppError(w, "An unexpected error has occurred", http.StatusInternalServerError)
			return
		}
	}
	utils.DisplayAppData(w, "success!", http.StatusOK)
}

// GET /tasks/users
func GetTasksByUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]
	// 连接shujuku
	session := utils.GetSession().Copy()
	defer session.Close()
	c := session.DB(utils.AppConfig.Database).C("tasks")
	//
	taskModel := &models.TaskModel{c}
	taskRes := taskModel.GetTasksByUser(username)
	utils.DisplayAppData(w, taskRes, http.StatusOK)
}
