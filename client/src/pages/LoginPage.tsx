import { useNavigate } from "react-router-dom";
import AuthForm from "../components/common/AuthForm";

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Вхід"
      endpoint="http://localhost:5000/api/auth/login" // змінити після підключення бекенду
      onSuccess={() => navigate("/")}
    />
  );
}
