import { useNavigate } from "react-router-dom";

export default function HeroSection() {

  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-primary to-blue-500 text-white shadow-inner">
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Ласкаво просимо!</h1>
      <p className="text-lg mb-6 max-w-xl text-white/90">
        Навчайся в зручному темпі, розвивай навички та досягай цілей разом з нами.
      </p>
      <button className="bg-white text-blue-400 font-semibold px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition"
        onClick={() => navigate(`/courses-list`)}>
        Переглянути курси
      </button>
    </section>
  );
}
