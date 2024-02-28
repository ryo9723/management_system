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

func setupCORS(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
}

func getAppointments(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}
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
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	json.NewEncoder(w).Encode(appointments)
}

func createAppointment(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	var newAppointment Appointment
	err := json.NewDecoder(r.Body).Decode(&newAppointment)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	db, err := sql.Open("mysql", "root:rootroot@/management_system")
	if err != nil {
		log.Printf("Database connection failed: %v", err)
		http.Error(w, "Database connection failed", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	stmt, err := db.Prepare(`
		INSERT INTO appointments (
			NextAppointmentDate, ContractedSales, CurrentContractCount, CompanyName, 
			CompanyNameKana, Capital, EmployeesCount, AppointmentDepartment,
			ContactPersonName, ContactPersonKana, URL, Place, AppointmentData,
			History, Goal
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	result, err := stmt.Exec(
		newAppointment.NextAppointmentDate,
		newAppointment.ContractedSales,
		newAppointment.CurrentContractCount,
		newAppointment.CompanyName,
		newAppointment.CompanyNameKana,
		newAppointment.Capital,
		newAppointment.EmployeesCount,
		newAppointment.AppointmentDepartment,
		newAppointment.ContactPersonName,
		newAppointment.ContactPersonKana,
		newAppointment.URL,
		newAppointment.Place,
		newAppointment.AppointmentData,
		newAppointment.History,
		newAppointment.Goal,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	newID, err := result.LastInsertId() // 新しい予約のIDを取得
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	newAppointment.ID = int(newID) // 新しい予約にIDをセット

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newAppointment)
}

func main() {
	http.HandleFunc("/", getAppointments)
	http.HandleFunc("/appointments/create", createAppointment)
	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
