import Navbar from '@/components/common/Navbar'; // Adjust path
import { AuthProvider } from '@/contexts/AuthContext'; // Adjust path
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'EduMarket',
   description: 'Your marketplace for educator resources.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
