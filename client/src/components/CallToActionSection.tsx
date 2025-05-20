import { Button } from "../components/ui/Button";

export default function CallToActionSection() {
  return (
    <section className="py-12 mt-32 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center shadow-inner rounded-3xl max-w-4xl mx-auto transition-transform duration-150 ease-in-out hover:scale-[1.05]">
      <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
        Готові розпочати навчання?
      </h2>
      <p className="text-lg mb-10 max-w-xl mx-auto text-white/90 leading-relaxed">
        Обирай курс і прокачуй свої навички вже сьогодні!
      </p>
      <Button
        onClick={() => alert("Зареєструватися!")}
        className="bg-white text-blue-500"
      >
        Зареєструватися
      </Button>
    </section>
  );
}
