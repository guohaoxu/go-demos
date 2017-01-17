package main

import (
  "fmt"
  "gopkg.in/mgo.v2"
)

var Session *mgo.Session

func main() {
  Session, err := mgo.Dial("localhost")
  defer Session.Close()
  if err != nil {
    fmt.Println("can't connect db")
  }
  fmt.Println("db connected succeful..")
  c := Session.DB("taskdb").C("categories")
  fmt.Println(c)
}
func get() {
  //
}
func add() {
  //
}
func update() {
  //
}
func delete() {
  //
}
