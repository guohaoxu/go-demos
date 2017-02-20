package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	type Employee struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	emp := Employee{Id: "123", Name: "Michael hao", Email: "michael@gmail.com"}
	b, _ := json.Marshal(emp)
	fmt.Println(string(b))

	newEmp := Employee{}
	str := `{"id":"124","name":"Brown","email":"brown@gmail.com"}`
	json.Unmarshal([]byte(str), &newEmp)
	fmt.Println(newEmp)

	/*
	  {"id":"123","name":"Michael hao","email":"michael@gmail.com"}
	  {124 Brown brown@gmail.com}
	*/
}
