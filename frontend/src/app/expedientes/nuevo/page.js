'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { expedientes } from '@/app/lib/api';

export default function NuevoExpedientePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    numeroExpediente: '',
    descripcion: '',
    ubicacion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="space-y-6">
      <div>
        <button 
          onClick={() => router.back()} 
          className="text-blue-600 hover:text-blue-800 mb-2"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Nuevo Expediente</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Número de Expediente *
            </label>
            <input
              type="text"
              name="numeroExpediente"
              value={formData.numeroExpediente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: EXP-2025-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del expediente..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ubicación *
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creando...' : 'Crear Expediente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
