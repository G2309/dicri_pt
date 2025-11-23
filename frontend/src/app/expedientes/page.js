'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { expedientes, auth } from '@/app/lib/api';

export default function ExpedientesPage() {
  const router = useRouter();
  const [expedientesList, setExpedientesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadExpedientes();
  }, []);

  const loadExpedientes = async () => {
    try {
      const response = await expedientes.getAll();
      setExpedientesList(response.expedientes);
    } catch (error) {
      console.error('Error cargando expedientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreate = user?.role === 'Técnico' || user?.role === 'Administrador';

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Expedientes</h1>
            {canCreate && (
              <button
                onClick={() => router.push('/expedientes/nuevo')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Nuevo Expediente
              </button>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {expedientesList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay expedientes registrados</p>
              ) : (
                <div className="space-y-4">
                  {expedientesList.map((exp) => (
                    <div
                      key={exp.ExpedienteId}
                      onClick={() => router.push(`/expedientes/${exp.ExpedienteId}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{exp.NumeroExpediente}</div>
                          <div className="text-sm text-gray-600">{exp.Descripcion}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Técnico: {exp.TecnicoNombre}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium h-fit ${
                            exp.Estado === 'Aprobado'
                              ? 'bg-green-100 text-green-800'
                              : exp.Estado === 'Rechazado'
                              ? 'bg-red-100 text-red-800'
                              : exp.Estado === 'En Revisión'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {exp.Estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
