import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/register/RegisterForm";

export default function Register() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}