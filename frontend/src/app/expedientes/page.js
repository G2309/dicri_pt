'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { expedientes } from '@/app/lib/api';

export default function ExpedientesPage() {
  const router = useRouter();
  const [expedientesList, setExpedientesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Expedientes</h1>
        <button
          onClick={() => router.push('/expedientes/nuevo')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nuevo Expediente
        </button>
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
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{exp.NumeroExpediente}</div>
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
    </div>
  );
}
