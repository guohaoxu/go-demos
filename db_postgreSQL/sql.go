package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type Product struct {
	ID          int
	Title       string
	Description string
	Price       float32
}

var db *sql.DB

func int() {
	var err error
	db, err = sql.Open("postgress", "postgress://user:password@localhost:port/dbname")
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	product := Product{
		Title:       "Amazon Echo",
		Description: "Amazon Echo - Black",
		Price:       179.99,
	}

	// Insert a Product
	createProduct(product)

	// Read all product redords
	getProducts()

}

func createProduct(prd Product) {
	result, err := db.Exec("INSERT INTO products(title, description, price) VALUES($1, $2, $3)", prd.Title, prd.Description, prd.Price)
	if err != nil {
		log.Fatal(err)
	}
	lastInsertID, err := result.LastInsertId()
	rowsAffected, err := result.RowsAffected()
	fmt.Printf("Product with id=%d created successfully (%d row affected)\n", lastInsertID, rowsAffected)
}

func getProducts() {
	rows, err := db.Query("SELECT * FROM products")
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No Records Found")
			return
		}
		log.Fatal(err)
	}
	defer rows.Close()

	var products []*Product
	for rows.Next() {
		prd := &Product{}
		err := rows.Scan(&prd.Title, &prd.Description, &prd.Price)
		if err != nil {
			log.Fatal(err)
		}
		products = append(products, prd)
	}
	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}
	for _, pr := range products {
		fmt.Printf("%s, %s, $%.2f\n", pr.Title, pr.Description, pr.Price)
	}
}
