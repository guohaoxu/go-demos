package models

import (
	"errors"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type (
	User struct {
		Id           bson.ObjectId `bson:"_id,omitempty" json:"id"`
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
	// 查询用户名是否已存在
	resultOne := User{}
	err = r.C.Find(bson.M{"username": user.Username}).One(&resultOne)
	if err != nil {
		// 用户名不存在
		user.Id = bson.NewObjectId()
		u = user
		err = r.C.Insert(user)
		return
	} else {
		// 用户名已存在
		err = errors.New("用户名已存在!")
		return
	}
	// hpass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	// if err != nil {
	// 	panic(err)
	// }
	// user.HashPassword = hpass
	// user.Password = ""
}

func (r *UserModel) Login(user User) (u User, err error) {
	err = r.C.Find(bson.M{"username": user.Username}).One(&u)
	if err != nil {
		return
	}
	if u.Password != user.Password {
		err = errors.New("密码错误!")
	}
	return
	// err = bcrypt.CompareHashAndPasswprd(u.HashPassword, []byte(user.Password))
	// if err != nil {
	// 	u = User{}
	// }
}
