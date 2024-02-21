import React, { useEffect, useState } from 'react';
import axios from "axios";

interface Appointment {
  id: number;
  nextAppointmentDate: string;
  contractedSales : number;
  currentContractCount: number;
  companyName: string;
  companyNameKana: string;
  capital: number;
  employeesCount: number;
  appointmentDepartment: string;
  contactPersonName: string;
  contactPersonKana: string;
  url: string;
  place: string;
  appointmentData: string;
  history: string;
  goal: number;
}

function App() {

  const buttonClick_detail = () => {

  }

  const buttonClick_edit = () => {
    
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    (
      async () => {
        const data = await axios.get("http://localhost:8080")
        console.log(data.data)
        console.log(data.data[0])
        setAppointments(data.data)
      }
    )()
  }, [])


  return (
    <table style={bodyStyle}>
    <thead style={headerStyle}>
      <tr>
        <th>次回アポ日付</th>
        <th>契約した売上</th>
        <th>現在の契約本数</th>
        <th>会社名</th>
        <th>ふりがな</th>
        <th>資本金</th>
        <th>従業員数</th>
        <th>アポ先部署</th>
        <th>担当者名</th>
        <th>ふりがな</th>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      {appointments.map(appointment => (
        <tr key={appointment.id}>
          <td>{appointment.nextAppointmentDate}</td>
          <td>{appointment.contractedSales.toLocaleString()}</td>
          <td>{appointment.currentContractCount}</td>
          <td>{appointment.companyName}</td>
          <td>{appointment.companyNameKana}</td>
          <td>{appointment.capital.toLocaleString()}</td>
          <td>{appointment.employeesCount}</td>
          <td>{appointment.appointmentDepartment}</td>
          <td>{appointment.contactPersonName}</td>
          <td>{appointment.contactPersonKana}</td>
          <td><a href={appointment.url} target="_blank" rel="noopener noreferrer">
              {appointment.url}
            </a></td>
            <button
              onClick={buttonClick_detail}
              style={buttonStyle}>詳細情報</button>
            <button
              onClick={buttonClick_edit}
              style={buttonStyle}>編集</button>
        </tr>
      ))}
    </tbody>
  </table>
  );
}

export default App;

const bodyStyle = {
  fontSize: '0.8rem',
}

const headerStyle = {
  backgroundColor: 'green',
  color: 'white',
}

const buttonStyle = {
  margin: "3px",
  backgroundColor: "gray",
  color: "#fff",
  border: "0px",
}
