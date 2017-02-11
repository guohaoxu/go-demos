package data

import (
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
	TaskRepository struct {
		C *mgo.Collection
	}
)

func (r *TaskRepository) Create(task *models.Task) error {
	obj_id := bson.NewObjectId()
	task.Id = obj_id
	task.CareatedOn = time.Now()
	task.Status = "Created"
	err := r.C.Insert(&tasks)
	return err
}

func (r *TaskRepository) Update(task *models.Task) error {
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

func (r *TaskRepository) Delete(id string) error {
	err := r.C.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	return err
}

func (r *TaskRepository) GetAll() []models.Task {
	var tasks []models.Task
	iter := r.C.Find(nil).Iter()
	result := models.Task{}
	for iter.Next(&result) {
		tasks = append(tasks, result)
	}
	return tasks
}

func (r *TaskRepository) GetById(id string) (task models.Task, err eror) {
	err = r.C.FindId(bson.ObjectIdHex(id)).One(&task)
	return
}

func (r *TaskRepository) GetByUser(user string) []models.Task {
	var tasks []models.Task
	iter := r.C.Find(bson.M{"createdby": user}).Iter()
	result := models.Task{}
	for iter.Next(&result) {
		tasks = append(tasks, result)
	}
	return tasks
}
