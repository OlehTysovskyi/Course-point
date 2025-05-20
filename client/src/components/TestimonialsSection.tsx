export default function TestimonialsSection() {
  const testimonials = [
    { id: 1, name: "Студент 1", text: "Дуже корисний курс, все зрозуміло і доступно!" },
    { id: 2, name: "Студент 2", text: "Отримав сертифікат і знайшов нову роботу." },
    { id: 3, name: "Студент 3", text: "Рекомендую всім, дуже цікаво!" },
  ];

  return (
    <section className="py-10 mt-24 px-6 max-w-7xl mx-auto bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-400 text-white rounded-3xl shadow-lg transition-transform duration-150 ease-in-out hover:scale-[1.02]">
      <h2 className="text-3xl font-extrabold text-center mb-8 drop-shadow-md">
        Відгуки наших студентів
      </h2>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {testimonials.map(({ id, name, text }) => (
          <div
            key={id}
            className="relative bg-white bg-opacity-40 rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center min-h-[180px]
                       transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-3 select-none shadow-md shrink-0">
              👤
            </div>

            <blockquote
              className="relative text-base italic leading-relaxed text-white text-center px-2 max-h-[80px] overflow-hidden"
            >
              <span className="before:content-['“'] before:text-white/30 before:text-3xl"></span>
              {text}
              <span className="after:content-['”'] after:text-white/30 after:text-3xl"></span>
            </blockquote>

            <div className="mt-auto pt-4">
              <p className="font-semibold text-lg">{name}</p>
            </div>

            <div className="absolute -bottom-5 w-10 h-5 bg-white bg-opacity-40 rounded-b-3xl left-1/2 transform -translate-x-1/2 shadow-sm"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
