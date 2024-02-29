import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appointment } from './types';
import { AxiosError } from 'axios';
import Modal from 'react-modal';
import AppointmentForm from './CreateAppointment';
import EditAppointmentForm from './EditAppointment';

const App = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState<boolean>(false);
  const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(false);
  const [goalValue, setGoalValue] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nextAppointmentDate: '',
    contractedSales: '',
    currentContractCount: '',
    companyName: '',
    companyNameKana: '',
    capital: '',
    employeesCount: '',
    appointmentDepartment: '',
    contactPersonName: '',
    contactPersonKana: '',
    url: '',
    place: '',
    appointmentData: '',
    history: '',
    goal: ''
  });

  // 予約データを取得する
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8080/')
      .then(response => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAppointment(appointment);
    setDetailModalIsOpen(true);
  };

  const openCreateModal = () => {
    setCreateModalIsOpen(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditModalIsOpen(true)
  }

  const closeDetailModal = () => {
    setDetailModalIsOpen(false);
  };

  const closeCreateModal = () => {
    setCreateModalIsOpen(false);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false)
  }

  const startEditGoal = () => {
    if (selectedAppointment) {
      setGoalValue(selectedAppointment.goal.toString());
      setEditGoal(true);
    }
  };

  // フォームの入力値を更新する
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalValue(e.target.value);
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  // 新規予約を作成する
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  // フォームデータの整数フィールドを整数に変換する
  const contractedSalesInt = parseInt(form.contractedSales, 10);
  const currentContractCountInt = parseInt(form.currentContractCount, 10);
  const capitalInt = parseInt(form.capital, 10);
  const employeesCountInt = parseInt(form.employeesCount, 10);
  const goalInt = parseInt(form.goal, 10);

  // バリデーション: 入力された値が整数であることを検証する
  if (
    isNaN(contractedSalesInt) ||
    isNaN(currentContractCountInt) ||
    isNaN(capitalInt) ||
    isNaN(employeesCountInt) ||
    isNaN(goalInt)
  ) {
    alert('すべての数値フィールドには整数を入力してください。');
    return;
  }

  // 整数に変換された値を持つ新しいオブジェクトを作成する
  const formData = {
    ...form,
    contractedSales: contractedSalesInt,
    currentContractCount: currentContractCountInt,
    capital: capitalInt,
    employeesCount: employeesCountInt,
    goal: goalInt,
  };

    try {
      const response = await axios.post('http://localhost:8080/appointments/create', formData);
    // 成功時の処理: 新規予約を予約リストに追加
      setAppointments([...appointments, response.data]);

    }  catch (error) {
      const e = error as Error | AxiosError; // AxiosErrorをimportする必要があります。
      if (axios.isAxiosError(e)) {
        // Axiosエラーの場合
        if (e.response) {
          console.error('Error response data:', e.response.data);
          console.error('Error response status:', e.response.status);
          console.error('Error response headers:', e.response.headers);
        } else if (e.request) {
          console.error('Error request:', e.request);
        } else {
          console.error('Error message:', e.message);
        }
        console.error('Error config:', e.config);
      } else {
        // 非Axiosエラーの場合
        console.error('Error', e.message);
      }
    }
  };

  const saveGoal = async () => {
    const updatedGoal = parseInt(goalValue, 10);
    if (!isNaN(updatedGoal) && selectedAppointment) {
      try {
        const response = await axios.put(`http://localhost:8080/appointments/${selectedAppointment.id}`, {
          ...selectedAppointment,
          goal: updatedGoal
        });
        // 予約リストを更新する
        setAppointments(prevAppointments => prevAppointments.map(a => a.id === selectedAppointment.id ? {...a, goal: updatedGoal} : a));
        setSelectedAppointment({...selectedAppointment, goal: updatedGoal});
        setEditGoal(false);
      } catch (error) {
        console.error('Error updating goal:', error);
        // エラーハンドリングをここに追加
      }
    } else {
      alert('入力された目標数値が無効です。');
    }
  };

  // テーブルの表示
  return (
    <div>
      <button
        onClick={openCreateModal}
        style={buttonStyle}
      >
        新規登録
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                <td>{appointment.contractedSales}</td>
                <td>{appointment.currentContractCount}</td>
                <td>{appointment.companyName}</td>
                <td>{appointment.companyNameKana}</td>
                <td>{appointment.capital}</td>
                <td>{appointment.employeesCount}</td>
                <td>{appointment.appointmentDepartment}</td>
                <td>{appointment.contactPersonName}</td>
                <td>{appointment.contactPersonKana}</td>
                <td><a href={appointment.url} target="_blank" rel="noopener noreferrer">
                {appointment.url}
              </a></td>
              <button
                onClick={() => openModal(appointment)}
                style={buttonStyle}
              >
                詳細情報
              </button>
              <button
                onClick={() => openEditModal(appointment)}
                style={buttonStyle}
              >
                編集
              </button>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
      isOpen={detailModalIsOpen}
      onRequestClose={closeDetailModal}
      style={customStyles}
      contentLabel='Appointment Detail'
      >
        {selectedAppointment && (
          <div>
            <h2>詳細データ</h2>
            <p>会社所在地：{selectedAppointment.place}</p>
            <p>アポ内容：{selectedAppointment.appointmentData}</p>
            <p>商談履歴：{selectedAppointment.history}</p>
            <p>ToDoリスト</p>
            {editGoal ? (
            <div>
              <input type="number" value={goalValue} onChange={handleChange} />
              <button onClick={saveGoal}>保存</button>
              <button onClick={() => setEditGoal(false)}>キャンセル</button>
            </div>
          ) : (
            <div>
              <p>目標数値：¥{selectedAppointment.goal.toLocaleString()}</p>
              <button onClick={startEditGoal}>編集</button>
            </div>
          )}
            <p>目標達成まで残り¥{(selectedAppointment.goal - selectedAppointment.contractedSales).toLocaleString()}</p>
            <button onClick={closeDetailModal}>閉じる</button>
          </div>
        )}
      </Modal>
      {/* 新規登録フォーム */}
      <Modal
        isOpen={createModalIsOpen}
        onRequestClose={closeCreateModal}
        style={customStyles}
        contentLabel='CreateAppointment'
      >
      <AppointmentForm
        setAppointments={setAppointments}
        closeModal={closeCreateModal}
      />
      </Modal>
      {/* 編集モーダル */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
        contentLabel='EditAppointment'
      >
        {selectedAppointment && (
          <EditAppointmentForm
            appointment={selectedAppointment}
            setAppointments={setAppointments}
            closeModal={closeEditModal}
          />
        )}
      </Modal>

    </div>
  );
};

export default App;
Modal.setAppElement('#root')

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
  cursor: "pointer"
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch' as 'auto' | 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '40px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};