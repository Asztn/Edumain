'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Adjust path
import { registerUser } from '@/services/authService'; // Adjust path
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Assuming backend returns user object alongside accessToken
      const { accessToken, user } = await registerUser({ email, password, name });
      login(accessToken, user);
      router.push('/'); // Redirect to homepage
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium" htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="border p-2 rounded w-full" />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 rounded w-full" />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 rounded w-full" />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors w-full">Register</button>
    </form>
  );
};
export default RegisterForm;
