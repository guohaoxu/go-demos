package main

import (
	"database/sql"
	"fmt"
	// _ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", string("user:password@tcp(127.0.0.1:3306)/testdb"))
	if err != nil {
		panic(err)
	}
	fmt.Println("mysql has connected")
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}
}
