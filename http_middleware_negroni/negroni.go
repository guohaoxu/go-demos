package main

import (
	"fmt"
	"net/http"

	"github.com/codegangsta/negroni"
)

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome!")
}
func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", index)
	n := negroni.New(
		negroni.NewRecovery(),
		negroni.NewLogger(),
		negroni.NewStatic(http.Dir("public")),
	)
	n.UseHandler(mux)
	n.Run(":8080")
}
