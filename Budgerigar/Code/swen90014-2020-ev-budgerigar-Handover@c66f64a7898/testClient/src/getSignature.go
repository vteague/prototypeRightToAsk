package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

func getSignature(msg string, pubKey string, priKey string) string {
	jsonPayload := map[string]interface{}{
		"msg": msg,
		"pubKey": pubKey,
		"priKey": priKey,
	}
	bytesRepresentation, err := json.Marshal(jsonPayload)
	if err != nil {
		log.Fatalln(err)
	}
	resp, err := http.Post("http://localhost:3001/sign", "application/json", bytes.NewBuffer(bytesRepresentation))
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	scanner := bufio.NewScanner(resp.Body)
	scanner.Scan()
	signature := ""
	for scanner.Text() != "" {
		signature = scanner.Text()
		scanner.Scan()
	}
	return signature
}