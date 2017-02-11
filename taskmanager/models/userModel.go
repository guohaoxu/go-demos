package data

import (
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type (
	User struct {
		Id           bson.ObjectId `json:"_id,omitempty" json:"id"`
		UserName     string        `json:"username"`
		Email        string        `json:"email"`
		Password     string        `json:"password,omitrmpty"`
		HashPassword []byte        `json:"hashpassword,omitempty"`
	}
	UserRepository struct {
		C *mgo.Collection
	}
)

func (r *UserRepository) CrateUser(user *models.User) error {
	obj_id := bson.NewObjectId()
	user.Id = obj_id
	hpass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	user.HashPassword = hpass
	user.Password = ""
	err = r.C.Insert(&user)
	return err
}

func (r *UserRepository) Login(user models.User) (u models.User, err error) {
	err = r.C.Find(bson.M{"email": user.Email}).One(&u)
	if err != nil {
		return
	}
	err = bcrypt.CompareHashAndPasswprd(u.HashPassword, []byte(user.Password))
	if err != nil {
		u = models.User{}
	}
	return
}
