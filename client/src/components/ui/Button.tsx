import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, isActive, className }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2 rounded-full font-semibold transition
        duration-200 ease-in-out
        ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
        hover:scale-105 hover:shadow-lg
        active:scale-100 active:shadow-md
        focus:outline-none focus:ring-4 focus:ring-blue-300
        ${className ? className : ""}
      `}
    >
      {children}
    </button>
  );
};
