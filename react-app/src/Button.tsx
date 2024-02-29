import React from 'react';

type ButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

// Buttonコンポーネントの定義
const Button: React.FC<ButtonProps> = ({ text, onClick, className, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;