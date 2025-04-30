export default function Footer() {
    return (
      <footer className="bg-blue-100 text-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">CoursePoint</h3>
            <p className="text-sm">Онлайн-платформа для навчання з сертифікатами.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Посилання</h4>
            <ul className="text-sm space-y-1">
              <li><a href="/" className="hover:underline">Головна</a></li>
              <li><a href="/courses" className="hover:underline">Курси</a></li>
              <li><a href="/login" className="hover:underline">Увійти</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Контакти</h4>
            <p className="text-sm">coursepoint@example.com</p>
            <p className="text-sm">+380 (00) 123-4567</p>
          </div>
        </div>
        <div className="text-center text-xs py-4 border-t border-gray-300">
          &copy; {new Date().getFullYear()} CoursePoint. Всі права захищені.
        </div>
      </footer>
    );
  }
  