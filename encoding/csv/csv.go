package main

import (
	"encoding/csv"
	"fmt"
	"os"
)

func main() {
	type Employee struct {
		Name    string
		Email   string
		Country string
	}
	file, _ := os.Open("./demo.csv")
	defer file.Close()
	reader := csv.NewReader(file)
	reader.FieldsPerRecord = 3
	reader.Comma = ';'
	csvData, err := reader.ReadAll()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	var emp Employee
	var emps []Employee
	for _, item := range csvData {
		emp.Name = item[0]
		emp.Email = item[1]
		emp.Country = item[2]
		emps = append(emps, emp)
	}
	fmt.Println(emps)

	csvFile, _ := os.Create("./new.csv")
	defer csvFile.Close()
	writer := csv.NewWriter(csvFile)
	writer.Comma = ';'
	for _, itemEmp := range emps {
		records := []string{itemEmp.Name, itemEmp.Email, itemEmp.Country}
		err := writer.Write(records)
		if err != nil {
			fmt.Println("Error: ", err)
			return
		}
	}
	writer.Flush()
}
