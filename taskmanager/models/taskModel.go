package models

import (
	"errors"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type (
	Task struct {
		Id          bson.ObjectId `bson:"_id,omitempty" json:"id"`
		CreatedBy   string        `json:"createdby"`
		Name        string        `json:"name"`
		Description string        `json:"description"`
		CreatedOn   time.Time     `json:"createdon,omitempty"`
		Due         time.Time     `json:"due,omitemprt"`
		Status      string        `json:"status,omitempty"`
		Tags        []string      `json:"tags,omitempty"`
	}
	TaskModel struct {
		C *mgo.Collection
	}
)

func (r *TaskModel) GetAll() []Task {
	var tasks []Task
	iter := r.C.Find(nil).Iter()
	result := Task{}
	for iter.Next(&result) {
		tasks = append(tasks, result)
	}
	return tasks
}

func (r *TaskModel) Create(task *Task) error {
	task.Id = bson.NewObjectId()
	task.CreatedOn = time.Now()
	task.Status = "Created"
	err := r.C.Insert(&task)
	return err
}

func (r *TaskModel) GetTaskById(id string) (task Task, err error) {
	if bson.IsObjectIdHex(id) {
		err = r.C.FindId(bson.ObjectIdHex(id)).One(&task)
		return
	} else {
		err = errors.New("error id")
		return
	}
}

func (r *TaskModel) Update(task *Task) error {
	err := r.C.Update(bson.M{"_id": task.Id},
		bson.M{
			"$set": bson.M{
				"name":        task.Name,
				"description": task.Description,
				"due":         task.Due,
				"status":      task.Status,
				"tags":        task.Tags,
			},
		},
	)
	return err
}

func (r *TaskModel) DeleteTask(id string) error {
	if bson.IsObjectIdHex(id) {
		err := r.C.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
		return err
	} else {
		err := errors.New("error id")
		return err
	}
}

func (r *TaskModel) GetTasksByUser(username string) []Task {
	var tasks []Task
	iter := r.C.Find(bson.M{"createdby": username}).Iter()
	result := Task{}
	for iter.Next(&result) {
		tasks = append(tasks, result)
	}
	return tasks
}
