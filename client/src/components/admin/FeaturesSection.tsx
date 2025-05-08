const features = [
    { title: "Гнучкий графік", desc: "Обирай зручний час для навчання", icon: "🕒" },
    { title: "Кваліфіковані викладачі", desc: "Навчайся у найкращих", icon: "🎓" },
    { title: "Сертифікати", desc: "Отримуй визнання своїх знань", icon: "📜" },
  ];
  
  export default function FeaturesSection() {
    return (
      <section className="grid md:grid-cols-3 gap-6 px-6 py-16 text-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition relative border border-gray-100"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-primary">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>
    );
  }
  