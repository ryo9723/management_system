import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Appointment } from './types';

import CreateAppointment from './CreateAppointment';
import EditAppointment from './EditAppointment';

const App: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:8080/');
                setAppointments(result.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const handleNewAppointment = () => {
      navigate('/create');
    };

    const handleEditAppointment = (id: number) => {
      navigate(`/edit/${id}`);
    };

    return (
        <div>
            <button onClick={handleNewAppointment}>新規登録</button>
            <table>
                <thead>
                    <tr>
                        <th>次回アポ日付</th>
                        <th>契約した売上</th>
                        <th>現在契約本数</th>
                        <th>会社名</th>
                        <th>ふりがな</th>
                        <th>資本金</th>
                        <th>従業員数</th>
                        <th>アポ部署</th>
                        <th>担当者名</th>
                        <th>ふりがな</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{appointment.nextAppointmentDate}</td>
                            <td>{appointment.contractedSales}</td>
                            <td>{appointment.companyName}</td>
                            <td>{appointment.companyNameKana}</td>
                            <td>{appointment.capital}</td>
                            <td>{appointment.employeesCount}</td>
                            <td>{appointment.appointmentDepartment}</td>
                            <td>{appointment.contactPersonName}</td>
                            <td>{appointment.contactPersonKana}</td>
                            <td>{appointment.url}</td>
                            <td>{appointment.place}</td>
                            <td>{appointment.appointmentData}</td>
                            <td>{appointment.history}</td>
                            <td>{appointment.goal}</td>
                            <td>
                                <button onClick={() => handleEditAppointment(appointment.id)}>編集</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Routes>
              <Route path="/create" element={<CreateAppointment />} />
              <Route path="/edit/:id" element={<EditAppointment />} />
            </Routes>
        </div>
    );
};

export default App;
