// EditAppointment.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditAppointment: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // ここで編集の処理を行います。

    // 処理が終わったら一覧ページに戻る
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* フォームの内容 */}
      <button type="submit">更新</button>
    </form>
  );
};

export default EditAppointment;
