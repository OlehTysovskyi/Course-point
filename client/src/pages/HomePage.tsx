export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-blue-100 px-4">
        <h1 className="text-4xl font-bold mb-4">Ласкаво просимо на платформу курсів</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-xl">
          Навчайся в зручному темпі, розвивай навички та досягай цілей разом з нами.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
          Переглянути курси
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-12 bg-white text-center">
        {[ 
          { title: "Гнучкий графік", desc: "Обирай зручний час для навчання" },
          { title: "Кваліфіковані викладачі", desc: "Навчайся у найкращих" },
          { title: "Сертифікати", desc: "Отримуй визнання своїх знань" },
        ].map((feature) => (
          <div key={feature.title} className="bg-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Popular Courses (mock) */}
      <section className="px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-8">Популярні курси</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition">
              <div className="h-40 bg-gray-200 rounded mb-4" />
              <h3 className="text-lg font-semibold">Назва курсу {i}</h3>
              <p className="text-sm text-gray-600 mt-2">Короткий опис курсу.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
