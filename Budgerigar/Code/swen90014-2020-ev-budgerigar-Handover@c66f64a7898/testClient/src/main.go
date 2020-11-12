package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func main () {
	if len(os.Args) != 4 {
		fmt.Println("usage - ./binary testFile.json username synctimestamp\nJSON filename, username missing or syncTime missing")
		return
	}
	fileName := os.Args[1]
	userName := os.Args[2]
	if validateInputs(fileName, userName) == false{
		return
	}
	logFile := setLogFile(fileName)
	log.SetOutput(logFile)

	synctimeStamp := os.Args[3]
	var requests Requests
	var key Keys
	successGet := 0
	passGet := false
	successPost := 0
	passPost := false
	successDel := 0
	passDel := false
	startTime := time.Now()

	/*
	* create a https client,
	* InsecureSkipVerify -> 'true' to test server running on localhost with an invalid ssl cert
	 */
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{
		Transport: tr,
		Timeout:   10000 * time.Millisecond,
	}

	//Read and store the public-private keys
	parseKeys(&key)

	//Read and store the test json file
	parseTestJsonFile(fileName, &requests)

	/*
	* Generate a UTC timestamp to sign payload and send in the header
	 */
	timeStamp := strconv.FormatInt(time.Now().UTC().Unix(), 10)

	for i := 0; i < len(requests.Posts); i++ {
		requests.Posts[i].PubKey = key.PubKey //from key.json
		requests.Posts[i].PriKey = key.PriKey //from key.json
		if requests.Posts[i].Username == "" {
			requests.Posts[i].Username = userName
		}
		//as cmdline argument read from username.txt for valid username,
		//else read invalid from test.json file
		if requests.IsRegister == true {
			if requests.Posts[i].ReqPayload != nil && requests.Posts[i].ReqPayload["username"] == nil {
				requests.Posts[i].ReqPayload["username"] = userName
			}
		} else {
			if requests.Posts[i].ReqPayload["username"] == "" {
				requests.Posts[i].ReqPayload["username"] = userName
			}
		}
		/* For registration, create the reqPayload and send only the public key
		 */
		var b []byte
		if requests.IsRegister == true {
			p := Payload{
				Username:  requests.Posts[i].Username,
				PublicKey: requests.Posts[i].PubKey,
			}
			b, _ = json.Marshal(p)
			json.Unmarshal(b, &requests.Posts[i].ReqPayload)
		} else {
			b, _ = json.Marshal(requests.Posts[i].ReqPayload)
		}
		msg := "v0:" + timeStamp + ":" + (string(b))
		rsp := getSignature(msg, requests.Posts[i].PubKey, requests.Posts[i].PriKey)
		var jsonMap map[string]interface{}
		json.Unmarshal([]byte(rsp), &jsonMap)
		requests.Posts[i].Sign = jsonMap["sign"].(string)
	}
	for i := 0; i < len(requests.Gets); i++ {
		requests.Gets[i].PubKey = key.PubKey //from key.json
		requests.Gets[i].PriKey = key.PriKey //from key.json
		requests.Gets[i].Username = userName //from cmdline argument read from username.txt
		msg := "v0:" + timeStamp + ":" + "{}"
		rsp := getSignature(msg, requests.Gets[i].PubKey, requests.Gets[i].PriKey)
		var jsonMap map[string]interface{}
		json.Unmarshal([]byte(rsp), &jsonMap)
		requests.Gets[i].Sign = jsonMap["sign"].(string)
	}
	for i := 0; i < len(requests.Dels); i++ {
		requests.Dels[i].PubKey = key.PubKey //from key.json
		requests.Dels[i].PriKey = key.PriKey //from key.json

		if requests.Dels[i].ReqPayload["username"] == "" {
			requests.Dels[i].ReqPayload["username"] = userName
		}
		b, _ := json.Marshal(requests.Dels[i].ReqPayload)
		msg := "v0:" + timeStamp + ":" + (string(b))
		rsp := getSignature(msg, requests.Dels[i].PubKey, requests.Dels[i].PriKey)
		var jsonMap map[string]interface{}
		json.Unmarshal([]byte(rsp), &jsonMap)
		requests.Dels[i].Sign = jsonMap["sign"].(string)
	}

	for i := 0; i < len(requests.Posts); i++ {
		requests.Posts[i].Host = requests.Host
		requests.Posts[i].Timestamp = timeStamp
		if sendPost(&requests.Posts[i], client, logFile) == true {
			successPost++
		}
		log.Println("------------------------------------------------------------------------------------------------")
	}

	for i := 0; i < len(requests.Gets); i++ {
		requests.Gets[i].Host = requests.Host
		requests.Gets[i].Timestamp = timeStamp
		if sendGet(&requests.Gets[i], client, logFile, synctimeStamp) == true {
			successGet++
		}
		log.Println("------------------------------------------------------------------------------------------------")
	}

	for i := 0; i < len(requests.Dels); i++ {
		requests.Dels[i].Host = requests.Host
		requests.Dels[i].Timestamp = timeStamp
		requests.Dels[i].Path = requests.Dels[i].Path + "/1"
		if sendDel(&requests.Dels[i], client, logFile, synctimeStamp) == true {
			successDel++
		}
		log.Println("------------------------------------------------------------------------------------------------")
	}

	if len(requests.Gets) == 0 && passPost == true {
		fmt.Println("passGet : ", passGet)
	}
	if len(requests.Posts) == 0 && passGet == true {
		fmt.Println("passPost : ", passPost)
	}
	if len(requests.Dels) == 0 && passDel == true {
		fmt.Println("passDel : ", passDel)
	}
	if successGet != 0 && successGet == len(requests.Gets) {
		fmt.Printf(BGreen)
		fmt.Println("All GET passed for ", fileName)
		passGet = true
		fmt.Printf(Reset)
	} else if len(requests.Gets) != 0 {
		fmt.Printf(BRed)
		fmt.Println("GET failed for ", fileName)
		passGet = false
		fmt.Printf(Reset)
	}
	if successPost != 0 && successPost == len(requests.Posts) {
		fmt.Printf(BGreen)
		fmt.Println("All POST passed for ", fileName)
		passPost = true
		fmt.Printf(Reset)
	} else if len(requests.Posts) != 0 {
		fmt.Printf(BRed)
		fmt.Println("POST failed for ", fileName)
		passGet = false
		fmt.Printf(Reset)
	}
	if successDel != 0 && successDel == len(requests.Dels) {
		fmt.Printf(BGreen)
		fmt.Println("All DELETE passed for ", fileName)
		passPost = true
		fmt.Printf(Reset)
	} else if len(requests.Dels) != 0 {
		fmt.Printf(BRed)
		fmt.Println("DELETE failed for ", fileName)
		passGet = false
		fmt.Printf(Reset)
	}
	fmt.Println("Total Time taken for " + fileName + " : " + time.Now().Sub(startTime).String())
	return
}

func sendPost(post *Post, client *http.Client, logFile *os.File) bool {
	log.Println("Testing the following")
	return makePostRequest(post, client, logFile)
}

func sendGet(get *Get, client *http.Client, logFile *os.File, synctimeStamp string) bool {
	log.Println("Testing the following")
	return makeGetRequest(get, client, logFile, synctimeStamp)
}
func sendDel(del *Delete, client *http.Client, logFile *os.File, synctimeStamp string) bool {
	log.Println("Testing the following")
	return makeDelRequest(del, client, logFile, synctimeStamp)
}

