// mysql demo
package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	db, err := sql.Open("mysql", "root:root2@tcp(127.0.0.1:3306)/db_test")
	checkErr(err)
	defer db.Close()

	err = db.Ping()
	checkErr(err)
	fmt.Println("Mysql connected...")

	// 更新数据
	stmt, err := db.Prepare("INSERT userinfo SET username=?, departname=?, created=?")
	checkErr(err)
	res, err := stmt.Exec("guohao", "研发部门", "2017-02-23")
	checkErr(err)
	id, err := res.LastInsertId()
	checkErr(err)
	fmt.Println(id)

	// 查询数据
	rows, err := db.Query("SELECT * FROM userinfo")
	checkErr(err)
	for rows.Next() {
		var uid int
		var username string
		var department string
		var created string
		err = rows.Scan(&uid, &username, &department, &created)
		checkErr(err)
		fmt.Println(uid)
		fmt.Println(username)
		fmt.Println(department)
		fmt.Println(created)
	}

	// 删除数据
	stmtDel, err := db.Prepare("DELETE FROM userinfo WHERE uid=?")
	checkErr(err)
	resDel, err := stmtDel.Exec(2)
	checkErr(err)
	affect, err := resDel.RowsAffected()
	checkErr(err)
	fmt.Println(affect)

}
