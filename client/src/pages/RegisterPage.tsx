import { useNavigate } from "react-router-dom";
import AuthForm from "../components/common/AuthForm";

export default function Register() {
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Реєстрація"
      endpoint="http://localhost:5000/api/auth/register" // змінити після підключення бекенду
      showRole
      onSuccess={() => navigate("/login")}
    />
  );
}
