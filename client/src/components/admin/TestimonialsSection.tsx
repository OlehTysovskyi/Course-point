export default function TestimonialsSection() {
    const testimonials = [
      { id: 1, name: "Студент 1", text: "Дуже корисний курс, все зрозуміло і доступно!" },
      { id: 2, name: "Студент 2", text: "Отримав сертифікат і знайшов нову роботу." },
      { id: 3, name: "Студент 3", text: "Рекомендую всім, дуже цікаво!" },
    ];
  
    return (
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Відгуки студентів</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition text-center border border-gray-100"
            >
              <div className="w-20 h-20 bg-primary/30 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-primary">
                👤
              </div>
              <p className="text-gray-700 italic">“{item.text}”</p>
              <p className="mt-4 font-semibold text-primary">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  