package models

import (
	"errors"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type (
	User struct {
		Id           bson.ObjectId `json:"_id,omitempty" json:"id"`
		Username     string        `json:"username"`
		Email        string        `json:"email"`
		Password     string        `json:"password,omitrmpty"`
		HashPassword []byte        `json:"hashpassword,omitempty"`
	}

	UserModel struct {
		C *mgo.Collection
	}
)

func (r *UserModel) CreateUser(user User) (u User, err error) {
	user.Id = bson.NewObjectId()
	// hpass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	// if err != nil {
	// 	panic(err)
	// }
	// user.HashPassword = hpass
	// user.Password = ""
	err = r.C.Insert(user)
	u = user
	return
}

func (r *UserModel) Login(user User) (u User, err error) {
	err = r.C.Find(bson.M{"username": user.Username}).One(&u)
	if err != nil {
		return
	}
	if u.Password != user.Password {
		err = errors.New("")
	}
	return
	// err = bcrypt.CompareHashAndPasswprd(u.HashPassword, []byte(user.Password))
	// if err != nil {
	// 	u = User{}
	// }
}
