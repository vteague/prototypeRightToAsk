package main

import (
	"bufio"
	"fmt"
	"net/http"
	"os"
	"strings"
)


//go run logClient.go list
//go run logClient.go post_api

func main() {
	url := os.Args[1]
	if strings.Compare(url, "list") == 0 {
		url = "http://localhost:8099/list"

	}else {
		url = "http://localhost:8099/" + url
	}
	fmt.Println(url)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()
	fmt.Println("Response status:", resp.Status)
	scanner := bufio.NewScanner(resp.Body)
	scanner.Scan()
	for scanner.Text() != "" {
		fmt.Println(scanner.Text())
		scanner.Scan()
	}
	if err := scanner.Err(); err != nil {
		panic(err)
	}
}
