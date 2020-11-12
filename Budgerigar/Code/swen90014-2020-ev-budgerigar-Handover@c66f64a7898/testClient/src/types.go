package main

var BRed="\033[1;31m" // Error
var BGreen="\033[1;32m"	// Success
var Reset   = "\033[0m\n"

type Requests struct {
	Host		string `json:"host"`
	IsRegister	bool `json:"isRegister"`
	Posts		[]Post `json:"POST"`
	Gets		[]Get `json:"GET"`
	Dels		[]Delete `json:"DELETE"`
}
type Payload struct {
	Username 	string `json:"username"`
	PublicKey 	string `json:"publicKey"`
}
type Keys struct {
	PubKey			string `json:"pubKey"`
	PriKey			string `json:"priKey"`
}
type Post struct {
	Path 			string `json:"path"`
	ReqPayload		map[string]interface{} `json:"requestPayload"`
	Username		string `json:"USERNAME"`
	PubKey			string
	PriKey			string
	RspStatus		string `json:"responseStatus"`
	Sign 			string
	Host			string
	Timestamp		string
}
type Get struct {
	Path 			string `json:"path"`
	RspStatus		string `json:"responseStatus"`
	Username		string `json:"USERNAME"`
	PubKey			string `json:"pubKey"`
	PriKey			string `json:"priKey"`
	Sign 			string
	Host			string
	Timestamp		string
}
type Delete struct {
	Path 			string `json:"path"`
	ReqPayload		map[string]interface{} `json:"requestPayload"`
	RspStatus		string	`json:"responseStatus"`
	Username		string `json:"USERNAME"`
	PubKey			string `json:"pubKey"`
	PriKey			string `json:"priKey"`
	Sign 			string
	Host			string
	Timestamp		string
}

