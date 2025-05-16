import React from "react";

type SearchBarProps = {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Пошук..."}
      className="w-full border rounded p-2"
    />
  );
}
