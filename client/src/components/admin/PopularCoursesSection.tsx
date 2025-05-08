const courses = [
    { id: 1, title: "Front-end для початківців", description: "Вивчай HTML, CSS, JavaScript з нуля." },
    { id: 2, title: "React для профі", description: "Глибоке розуміння компонентів, хуків і оптимізації." },
    { id: 3, title: "UI/UX дизайн", description: "Створюй красиві та зручні інтерфейси." },
  ];
  
  export default function PopularCoursesSection() {
    return (
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Популярні курси</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="h-40 bg-gradient-to-tr from-primary/40 to-blue-300 rounded mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{course.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  