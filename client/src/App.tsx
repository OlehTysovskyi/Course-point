import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
