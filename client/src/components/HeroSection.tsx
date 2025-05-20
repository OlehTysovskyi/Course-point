import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center text-center py-14 px-6 bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-400 text-white rounded-b-[5rem] shadow-xl transition-all duration-700 ease-in-out">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
        Ласкаво просимо
      </h1>
      <p className="text-lg md:text-xl max-w-2xl text-white mb-10 leading-relaxed">
        Навчайся у зручному темпі, розвивай нові навички та досягай цілей разом із нашою платформою.
      </p>
      <Button
        onClick={() => navigate(`/courses-list`)}
        className="bg-white text-cyan-600 shadow-md hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-lg"
      >
        Переглянути курси
      </Button>
    </section>
  );
}
