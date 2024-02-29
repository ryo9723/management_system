import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appointment } from './types';

type Props = {
  appointment: Appointment;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  closeModal: () => void;
};

const EditAppointmentForm: React.FC<Props> = ({ appointment, setAppointments, closeModal }) => {
  const [form, setForm] = useState<Appointment>(appointment);

  useEffect(() => {
    // 選択された予約が変わった場合にフォームを更新する
    setForm(appointment);
  }, [appointment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8080/appointments/${form.id}`, form);
      setAppointments(prevAppointments => prevAppointments.map(a => a.id === form.id ? { ...a, ...form } : a));
      closeModal();
    } catch (error) {
      console.error('Error updating appointment:', error);
      // ここでユーザーにエラーを通知する方法を実装する
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 予約データの各フィールドに対応するフォーム要素を追加 */}
      <div>
        <label>
          次回アポ日付:
          <input
            name="nextAppointmentDate"
            type="date"
            value={form.nextAppointmentDate}
            onChange={handleChange}
          />
        </label>
      </div>
      {/* 他のフィールドも同様に追加 */}
      <button type="submit">保存</button>
    </form>
  );
};

export default EditAppointmentForm;
