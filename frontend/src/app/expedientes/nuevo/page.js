'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { expedientes, auth } from '@/app/lib/api';

export default function NuevoExpedientePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    numeroExpediente: '',
    descripcion: '',
    ubicacion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = auth.getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Validar que el usuario puede crear expedientes
    if (user.role !== 'Técnico' && user.role !== 'Administrador') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await expedientes.create(formData);
      router.push(`/expedientes/${response.expediente.ExpedienteId}`);
    } catch (err) {
      setError(err.message || 'Error al crear expediente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <button 
              onClick={() => router.back()} 
              className="text-blue-600 hover:text-blue-800 mb-2 transition-colors"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Nuevo Expediente</h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Expediente *
                </label>
                <input
                  type="text"
                  name="numeroExpediente"
                  value={formData.numeroExpediente}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Ej: EXP-2025-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Descripción del expediente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Ubicación física del expediente"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/expedientes')}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Creando...' : 'Crear Expediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
