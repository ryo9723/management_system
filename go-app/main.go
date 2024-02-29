package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

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
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT")
	(*w).Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	if (*req).Method == "OPTIONS" {
		return
	}
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
	json.NewEncoder(w).Encode(appointments)
}

func createAppointment(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)

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

func updateAppointment(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)

	pathSegments := strings.Split(r.URL.Path, "/")
	if len(pathSegments) < 3 {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	var updateAppointment Appointment
	err := json.NewDecoder(r.Body).Decode(&updateAppointment)
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

	appointmentIDStr := pathSegments[2]
	appointmentID, err := strconv.Atoi(appointmentIDStr)
	if err != nil {
		http.Error(w, "Invalid appointment ID", http.StatusBadRequest)
		return
	}

	stmt, err := db.Prepare(`
		UPDATE appointments SET
			NextAppointmentDate = ?,
			ContractedSales = ?,
			CurrentContractCount = ?,
			CompanyName = ?,
			CompanyNameKana = ?,
			Capital = ?,
			EmployeesCount = ?,
			AppointmentDepartment = ?,
			ContactPersonName = ?,
			ContactPersonKana = ?,
			URL = ?,
			Place = ?,
			AppointmentData = ?,
			History = ?,
			Goal = ?
		WHERE ID = ?
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		updateAppointment.NextAppointmentDate,
		updateAppointment.ContractedSales,
		updateAppointment.CurrentContractCount,
		updateAppointment.CompanyName,
		updateAppointment.CompanyNameKana,
		updateAppointment.Capital,
		updateAppointment.EmployeesCount,
		updateAppointment.AppointmentDepartment,
		updateAppointment.ContactPersonName,
		updateAppointment.ContactPersonKana,
		updateAppointment.URL,
		updateAppointment.Place,
		updateAppointment.AppointmentData,
		updateAppointment.History,
		updateAppointment.Goal,
		appointmentID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(updateAppointment)
}

func main() {
	http.HandleFunc("/", getAppointments)
	http.HandleFunc("/appointments/create", createAppointment)
	http.HandleFunc("/appointments", updateAppointment)
	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
