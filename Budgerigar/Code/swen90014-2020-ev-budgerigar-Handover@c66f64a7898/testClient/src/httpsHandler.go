package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)
func logGet(get *Get){
	log.Printf("GET 	: %38s\n" , get.Host + get.Path)
	log.Printf("Expecting Status	: %40s\n" , get.RspStatus)
}
func logPost(post *Post){
	log.Printf("POST	: %38s\n" , post.Host + post.Path)
	log.Printf("Sending Payload	: %s\n" , post.ReqPayload)
	log.Printf("Expecting Status 	: %40s\n" , post.RspStatus)
}
func logDel(del *Delete){
	log.Printf("DELETE	: %38s\n" , del.Host + del.Path)
	log.Printf("Sending Payload	: %s\n" , del.ReqPayload)
	log.Printf("Expecting Status 	: %40s\n" , del.RspStatus)
}

func updateTimestampFile(startTime time.Time){
	formatted := fmt.Sprintf("%d-%02d-%02dT%02d:%02d",
		startTime.Year(), startTime.Month(), startTime.Day(),
		startTime.Hour(), startTime.Minute())
	f, err := os.Create("synctimeStamp.txt")
	if err != nil {
		fmt.Println(err)
		return
	}
	f.WriteString(formatted)
	err = f.Close()
	if err != nil {
		fmt.Println(err)
		return
	}
}
func makeDelRequest(del *Delete, client *http.Client , logFile *os.File, timeStamp string) bool{
	log.SetOutput(logFile)
	logDel(del)
	startTime := time.Now()

	bytesRepresentation, err := json.Marshal(del.ReqPayload)
	if err != nil {
		fmt.Printf(BRed)
		fmt.Println(err)
		log.Println(err)
		fmt.Printf(Reset)
		return false
	}
	req, err := http.NewRequest("DELETE", del.Host + del.Path , bytes.NewBuffer(bytesRepresentation))
	if err != nil {
		log.Fatal("Error reading request. ", err)
	}

	uName := del.Username
	req.Header.Set(`Accept`, `accept: 'application/json, text/plain, */*'`)
	req.Header.Set(`Content-Type`, `application/json;charset=utf-8`)
	req.Header.Set(`RightToAsk-Auth`, del.Sign)
	req.Header.Set(`RightToAsk-Timestamp`, del.Timestamp)
	req.Header.Set(`RightToAsk-Username`, uName)

	log.Println("Sending request...")
	log.Println(req)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Error reading response. ", err)
	}
	if err != nil {
		fmt.Printf(BRed)
		fmt.Println(err)
		log.Println(err)
		fmt.Printf(Reset)
		return false
	}
	log.Println("Response body:")
	scanner := bufio.NewScanner(resp.Body)
	scanner.Scan()
	for scanner.Text() != "" {
		log.Println("%s\n", scanner.Text())
		scanner.Scan()
	}
	log.Printf("Response status	: %50s\n", resp.Status)
	if del.RspStatus == resp.Status {
		log.Println(del.Host + del.Path + "Time taken: ", time.Now().Sub(startTime).String())
		return true
	} else{
		log.Println("Response code does not match")
		return false
	}
}

func makeGetRequest(get *Get, client *http.Client , logFile *os.File, timeStamp string) bool{
	log.SetOutput(logFile)
	logGet(get)
	startTime := time.Now().UTC()
	formatted := ""
	if timeStamp == "0"{
		//set this as starting timestamp before any Sync
		formatted = "2020-10-20T16:00"
	}else{
		formatted = timeStamp
	}
	req, err := http.NewRequest("GET", get.Host + get.Path + "?last_sync=" + formatted , nil)
	if err != nil {
		log.Fatal("Error reading request. ", err)
	}

	uName := get.Username
	req.Header.Set(`Accept`, `accept: 'application/json, text/plain, */*'`)
	req.Header.Set(`Content-Type`, `application/json;charset=utf-8`)
	req.Header.Set(`RightToAsk-Auth`, get.Sign)
	req.Header.Set(`RightToAsk-Timestamp`, get.Timestamp)
	req.Header.Set(`RightToAsk-Username`, uName)

	log.Println("Sending request...")
	log.Println(req)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Error reading response. ", err)
	}
	if err != nil {
		fmt.Printf(BRed)
		fmt.Println(err)
		log.Println(err)
		fmt.Printf(Reset)
		return false
	}
	log.Println("Response status:", resp.Status)
	log.Println("Response body  :")
	scanner := bufio.NewScanner(resp.Body)
	scanner.Scan()
	for scanner.Text() != "" {
		//fmt.Println(scanner.Text())
		rspStr := scanner.Text()
		log.Printf("%s\n", rspStr)
		var out bytes.Buffer
		err := json.Indent(&out, []byte(rspStr), "", "\t")
		if err != nil {
			return false
		}
		log.Println(out.String())
		scanner.Scan()
	}
	if err := scanner.Err(); err != nil {
		fmt.Println(err)
		log.Println(err)					
		return false
	}
	log.Printf("Response status	: %50s\n", resp.Status)
	if get.RspStatus == resp.Status {
		log.Println("Response code MATCHES")
		log.Println("GET: " + get.Host + get.Path +  " : time take " , time.Now().Sub(startTime).String())
		updateTimestampFile(startTime)
		return true
	}else{
		log.Println("Response code does not match")
		return false
	}
}
func makePostRequest(post *Post, client *http.Client, logFile *os.File) bool{
	log.SetOutput(logFile)
	logPost(post)
	bytesRepresentation, err := json.Marshal(post.ReqPayload)
	if err != nil {
		fmt.Printf(BRed)
		fmt.Println(err)
		log.Println(err)
		fmt.Printf(Reset)
		return false
	}
	startTime := time.Now()

	req, err := http.NewRequest("POST", post.Host + post.Path, bytes.NewBuffer(bytesRepresentation))
	if err != nil {
		log.Fatal("Error reading request. ", err)
	}
	/* this is for non registration requests
	*/
	if post.ReqPayload != nil {
		uName := post.ReqPayload["username"].(string)
		req.Header.Set(`Accept`, `accept: 'application/json, text/plain, */*'`)
		req.Header.Set(`Content-Type`, `application/json;charset=utf-8`)
		req.Header.Set(`RightToAsk-Auth`, post.Sign)
		req.Header.Set(`RightToAsk-Timestamp`, post.Timestamp)
		req.Header.Set(`RightToAsk-Username`, uName)
	}
	log.Println("Sending request...")
	log.Println(req)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Error reading response. ", err)
	}
	log.Println("Response body:")
	scanner := bufio.NewScanner(resp.Body)
	scanner.Scan()
	for scanner.Text() != "" {
		rspStr := scanner.Text()
		log.Printf("%s\n", rspStr)
		var out bytes.Buffer
		err := json.Indent(&out, []byte(rspStr), "", "\t")
		if err != nil {
			return false
		}
		scanner.Scan()
	}
	log.Printf("Response status	: %50s\n", resp.Status)
	if post.RspStatus == resp.Status {
		log.Println(post.Host + post.Path + "Time taken: ", time.Now().Sub(startTime).String())
		return true
	} else{
		log.Println("Response code does not match")
		return false
	}
}
