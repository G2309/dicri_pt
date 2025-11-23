'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/api';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const user = auth.getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <span className="font-bold text-xl">DICRI</span>
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/expedientes" className="text-gray-700 hover:text-gray-900">Expedientes</a>
              {(user.role === 'Coordinador' || user.role === 'Administrador') && (
                <a href="/revision" className="text-gray-700 hover:text-gray-900">Revisión</a>
              )}
              <a href="/reportes" className="text-gray-700 hover:text-gray-900">Reportes</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.fullName} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
