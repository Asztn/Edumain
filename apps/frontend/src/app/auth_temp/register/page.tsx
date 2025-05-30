import RegisterForm from '@/components/auth/RegisterForm'; // Adjust path
export default function RegisterPage() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
      <RegisterForm />
    </div>
  );
}
