package main

import (
	"encoding/xml"
	"fmt"
)

func main() {
	type EmployeeCountry struct {
		CountryCode string `xml:"code,attr"`
		CountryName string `xml:",chardata"`
	}
	type Employee struct {
		XMLName xml.Name        `xml:"employee"`
		Id      string          `xml:"id"`
		Name    string          `xml:"name"`
		Email   string          `xml:"email"`
		Country EmployeeCountry `xml:"country"`
	}

	emp := Employee{Id: "123", Name: "Michael", Email: "michael@gmail.com", Country: EmployeeCountry{CountryCode: "CN", CountryName: "CHINA"}}
	b, _ := xml.Marshal(emp)
	fmt.Println(string(b))
	/*
	   <employee><id>123</id><name>Michael</name><email>michael@gmail.com</email><country code="CN"><chardata>CHINA</chardata></country></employee>
	*/
}
