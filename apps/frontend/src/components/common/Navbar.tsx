'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // Adjust path

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();

  // Optional: A simple loading state for the navbar itself,
  // though AuthProvider handles its own isLoading state for children.
  if (isLoading) {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">EduMarket</Link>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">EduMarket</Link>
        <div className="space-x-4">
          <Link href="/resources" className="hover:text-gray-300">Resources</Link>
          {user ? (
            <>
              {/* Simple greeting, can be a dropdown for more options */}
              <span className="text-gray-300">Hi, {user.name || user.email}</span>
              <button onClick={logout} className="hover:text-gray-300">Logout</button>
              {/* Example: Link to a dashboard page if user is a SELLER or ADMIN */}
              {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
              <Link href="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
