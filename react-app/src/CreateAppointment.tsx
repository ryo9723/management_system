// CreateAppointment.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAppointment: React.FC = () => {
  const [nextAppointmentDate, setNextAppointmentDate] = useState('');
  const [contractedSales, setContractedSales] = useState('');
  const [error, setError] = useState('');

  // ...他の状態変数も同様に設定

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/appointments', {
        nextAppointmentDate,
        contractedSales: parseInt(contractedSales, 10),
        // ...他のフィールドも同様に
      });

      // 成功した場合は、一覧表示に戻る
      if (response.status === 200) {
        navigate('/App');
      }
    } catch (error) {
      setError('フォームの送信中エラーが発生しました。');
      console.error('Error submitting form: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          次の予約日:
          <input
            type="date"
            value={nextAppointmentDate}
            onChange={(e) => setNextAppointmentDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          契約済みの売上:
          <input
            type="number"
            value={contractedSales}
            onChange={(e) => setContractedSales(e.target.value)}
          />
        </label>
      </div>
      {/* ...他の入力フィールド */}
      <button type="submit">新規登録</button>
    </form>
  );
};

export default CreateAppointment;
