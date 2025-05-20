const features = [
  { title: "Гнучкий графік", desc: "Обирай зручний час для навчання", icon: "🕒", color: "from-pink-400 to-red-400" },
  { title: "Кваліфіковані викладачі", desc: "Навчайся у найкращих", icon: "🎓", color: "from-blue-400 to-indigo-500" },
  { title: "Сертифікати", desc: "Отримуй визнання своїх знань", icon: "📜", color: "from-green-400 to-emerald-500" },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative p-8 pt-16 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div
              className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-t-[80%] rounded-b-[80%] bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-4xl shadow-lg`}
              style={{
                borderBottomLeftRadius: '60% 100%',
                borderBottomRightRadius: '60% 100%',
              }}
            >
              {feature.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
