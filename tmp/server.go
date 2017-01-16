package main

import (
  "fmt"
  "net/http"
)

func main() {
  fmt.Println("服务已开启，请访问本地3000端口...")
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Add("server", "Gogogo Server")
    fmt.Fprintf(w, `
      <html>
        <head>
          <title>This is coded by go.</title>
        </head>
        <body>
        <h1>Hello Goher</h1>
        <p>This is home page.<a href="/users">users</a> <a href="/error">error</a></p>
        </body>
      </html>
    `)
  })
  http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Add("server", "Gogogo Server")
    fmt.Fprintf(w, `
      <html>
        <head>
          <title>This is coded by go.</title>
        </head>
        <body>
        <h1>Hello Goher</h1>
        <p>This is users page.<a href="/">home</a> <a href="/error">error</a></p>
        </body>
      </html>
    `)
  })
  http.HandleFunc("/error", func(w http.ResponseWriter, r *http.Request) {
    http.Error(w, "Something has gone wrong", 500)
  })
  http.ListenAndServe(":3000", nil)
}
