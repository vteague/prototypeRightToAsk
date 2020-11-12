package main

import (
	"fmt"
	"net/http"
	"os/exec"
)
func execIt(path string) {
	cmd := exec.Command("/bin/bash", "-c", path)
	cmd.Output()
	return
}
func logIt(path string) (string) {
	cmd := exec.Command("/bin/bash", "-c", path)
	op, err := cmd.Output()
	if err != nil {
		return "error"
	}
	return string(op)
}
func list(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, logIt("cd ../ && sudo docker ps  -a --format '{{.Names}}'"))
}

func logs(w http.ResponseWriter, req *http.Request) {
	var str1 = "cd ../ && sudo docker logs -t " + req.URL.RequestURI()[1:]
	fmt.Fprintf(w, logIt(str1))
}
func report(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "/report/nginx_api\n/report/nginx_service")
}
func reportApi(w http.ResponseWriter, req *http.Request) {
	execIt("rm -rf nginx_api.log")
	str1 := logIt("sudo docker logs nginx_api > nginx_api.log")
	if str1 == "error"{
		fmt.Fprintf(w, "Error in generating logs")
		return
	}
	execIt("sudo goaccess -f nginx_api.log -o reportApiNginx.html --log-format=COMBINED")
	http.ServeFile(w, req, "reportApiNginx.html")
}
func reportService(w http.ResponseWriter, req *http.Request) {
	execIt("rm -rf nginx_service.log")
	str1 := logIt("sudo docker logs nginx_service > nginx_service.log")
	if str1 == "error"{
		fmt.Fprintf(w, "Error in generating nginx_service logs")
		return
	}
	execIt("sudo goaccess -f nginx_service.log -o reportServiceNginx.html --log-format=COMBINED")
	http.ServeFile(w, req, "reportServiceNginx.html")
}
func main() {
	fmt.Println("listening on port 8099")
	http.HandleFunc("/", logs)
	http.HandleFunc("/list", list)
	http.HandleFunc("/report", report)
	http.HandleFunc("/report/nginx_api", reportApi)
	http.HandleFunc("/report/nginx_service", reportService)
	err := http.ListenAndServeTLS(":8099", "fullchain.pem", "privkey.pem", nil)
	if err != nil {
		fmt.Println(err)
		return
	}
}
