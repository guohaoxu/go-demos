package utils

import (
	"encoding/json"
	"net/http"
)

/**
 * {
 *  "code": 0,
 *  "message": "错误信息"
 * }
 */
func DisplayAppError(w http.ResponseWriter, message string, httpStatus int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	j, err := json.Marshal(struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}{0, message})
	if err != nil {
		panic(err)
	}
	w.Write(j)
}

/**
 * {
 *  "code": 1,
 *  "data": "data信息"
 * }
 */
func DisplayAppData(w http.ResponseWriter, data interface{}, httpStatus int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	j, err := json.Marshal(struct {
		Code int         `json:"code"`
		Data interface{} `json:"data"`
	}{1, data})
	if err != nil {
		panic(err)
	}
	w.Write(j)
}
