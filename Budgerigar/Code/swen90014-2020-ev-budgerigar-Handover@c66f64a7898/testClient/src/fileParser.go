package main

import (
	`encoding/json`
	`fmt`
	`io/ioutil`
	`log`
	`os`
	`strings`
)

func validateInputs(fileName string, userName string) bool{
	if fileName != "" && false == strings.Contains(fileName, "json") {
		fmt.Println("invalid filename")
		return false
	}
	if userName == "" {
		fmt.Println("invalid username")
		return false
	}
	return true
}
func setLogFile(fileName string) *os.File{
	logs := "logs/Results_" + fileName[11:] + ".LOG"
	logFile, err := os.OpenFile(logs, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}
	return logFile
}
func parseKeys(key *Keys){
	keyFile, err := os.Open("json_files/keys.json")
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	defer keyFile.Close()
	byteValue, err := ioutil.ReadAll(keyFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	_ = json.Unmarshal(byteValue, &key)
}
func parseTestJsonFile(fileName string, requests *Requests){
	jsonFile, err := os.Open(fileName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	_ = json.Unmarshal(byteValue, requests)
}
