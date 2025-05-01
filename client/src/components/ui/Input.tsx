type InputProps = {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
  };
  
  export default function Input({ type = "text", value, onChange, placeholder, name }: InputProps) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className="w-full p-2 border rounded"
      />
    );
  }
  