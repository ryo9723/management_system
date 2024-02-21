package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Appointment struct {
	ID                    int    `json:"id"`
	NextAppointmentDate   string `json:"nextAppointmentDate"`
	ContractedSales       int    `json:"contractedSales"`
	CurrentContractCount  int    `json:"currentContractCount"`
	CompanyName           string `json:"companyName"`
	CompanyNameKana       string `json:"companyNameKana"`
	Capital               int    `json:"capital"`
	EmployeesCount        int    `json:"employeesCount"`
	AppointmentDepartment string `json:"appointmentDepartment"`
	ContactPersonName     string `json:"contactPersonName"`
	ContactPersonKana     string `json:"contactPersonKana"`
	URL                   string `json:"url"`
	Place                 string `json:"place"`
	AppointmentData       string `json:"appointmentData"`
	History               string `json:"history"`
	Goal                  int    `json:"goal"`
}

func getAppointments(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "root:rootroot@/management_system")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM appointments")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var appointments []Appointment
	for rows.Next() {
		var a Appointment
		if err := rows.Scan(
			&a.ID,
			&a.NextAppointmentDate,
			&a.ContractedSales,
			&a.CurrentContractCount,
			&a.CompanyName,
			&a.CompanyNameKana,
			&a.Capital,
			&a.EmployeesCount,
			&a.AppointmentDepartment,
			&a.ContactPersonName,
			&a.ContactPersonKana,
			&a.URL,
			&a.Place,
			&a.AppointmentData,
			&a.History,
			&a.Goal,
		); err != nil {
			log.Fatal(err)
		}
		appointments = append(appointments, a)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	json.NewEncoder(w).Encode(appointments)
}

func main() {
	http.HandleFunc("/", getAppointments)
	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

//機能Done
