type SearchBarProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
};

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
    return (
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Пошук за ім'ям або поштою..."
            className="w-full border p-2 rounded"
        />
    );
}
