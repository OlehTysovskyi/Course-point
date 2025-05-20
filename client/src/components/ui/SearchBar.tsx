type SearchBarProps = {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Пошук..."}
      className={`w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${className ?? ""}`}
    />
  );
}
