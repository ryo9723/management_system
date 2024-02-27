import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appointment } from './types';
import { AxiosError } from 'axios';

const App = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  // フォームの入力値を更新する
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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


  // テーブルの表示
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Next Appointment Date</th>
              <th>Contracted Sales</th>
              <th>Current Contract Count</th>
              {/* ...他のヘッダー */}
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.nextAppointmentDate}</td>
                <td>{appointment.contractedSales}</td>
                <td>{appointment.currentContractCount}</td>
                {/* ...他のデータ */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* 新規登録フォーム */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            次アポ日付
            <input
              name="nextAppointmentDate"
              value={form.nextAppointmentDate}
              onChange={handleChange}
              type="date"
            />
          </label>
        </div>
        <div>
          <label>
            契約した売上
            <input
              name="contractedSales"
              value={form.contractedSales}
              onChange={handleChange}
              type="number"
            />
          </label>
        </div>
        <div>
          <label>
            契約本数
            <input
              name="currentContractCount"
              type="number"
              value={form.currentContractCount}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            会社名
            <input
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            ふりがな
            <input
              name="companyNameKana"
              type="text"
              value={form.companyNameKana}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            資本金
            <input
              name="capital"
              type="number"
              value={form.capital}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            従業員数
            <input
              name="employeesCount"
              type="number"
              value={form.employeesCount}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            アポ部署
            <input
              name="appointmentDepartment"
              type="text"
              value={form.appointmentDepartment}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            対応者
            <input
              name="contactPersonName"
              type="text"
              value={form.contactPersonName}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            ふりがな
            <input
              name="contactPersonKana"
              type="text"
              value={form.contactPersonKana}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            URL
            <input
              name="url"
              type="text"
              value={form.url}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            所在地
            <input
              name="place"
              type="text"
              value={form.place}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            アポ内容
            <input
              name="appointmentData"
              type="text"
              value={form.appointmentData}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            ゴール
            <input
              name="goal"
              type="number"
              value={form.goal}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">新規登録</button>
      </form>
    </div>
  );
};

export default App;
