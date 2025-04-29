import { useNavigate } from "react-router-dom";
import AuthForm from "../components/common/AuthForm";

export default function RegisterPage() {
  const navigate = useNavigate();
  return <AuthForm title="Реєстрація" showRole onSuccess={() => navigate("/login")} />;
}
