import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      type="button"
      className={`
        px-6 py-2 rounded-full font-semibold transition
        duration-200 ease-in-out
        bg-blue-600 text-white
        hover:scale-105 hover:shadow-lg
        active:scale-100 active:shadow-md
        focus:outline-none focus:ring-4 focus:ring-blue-300
        ${className ?? ""}
      `}
    >
      Назад
    </button>
  );
};
