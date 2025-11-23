'use client';

import { useEffect, useState } from 'react';
import { reportes, expedientes } from '@/app/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentExpedientes, setRecentExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, expedientesData] = await Promise.all([
        reportes.getEstadisticas(),
        expedientes.getAll(),
      ]);
      setStats(statsData.estadisticas);
      setRecentExpedientes(expedientesData.expedientes.slice(0, 5));
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm mb-2">Total Expedientes</div>
          <div className="text-3xl font-bold text-gray-800">
            {stats?.TotalExpedientes || 0}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <div className="text-blue-600 text-sm mb-2">En Revisión</div>
          <div className="text-3xl font-bold text-blue-700">
            {stats?.TotalEnRevision || 0}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow">
          <div className="text-green-600 text-sm mb-2">Aprobados</div>
          <div className="text-3xl font-bold text-green-700">
            {stats?.TotalAprobados || 0}
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow">
          <div className="text-red-600 text-sm mb-2">Rechazados</div>
          <div className="text-3xl font-bold text-red-700">
            {stats?.TotalRechazados || 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Expedientes Recientes</h2>
        </div>
        <div className="p-6">
          {recentExpedientes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay expedientes</p>
          ) : (
            <div className="space-y-4">
              {recentExpedientes.map((exp) => (
                <div
                  key={exp.ExpedienteId}
                  className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      {exp.NumeroExpediente}
                    </div>
                    <div className="text-sm text-gray-600">{exp.Descripcion}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Técnico: {exp.TecnicoNombre}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/expedientes/nuevo"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 text-center"
        >
          <div className="text-2xl mb-2">+</div>
          <div className="font-semibold">Nuevo Expediente</div>
        </a>
        <a
          href="/expedientes"
          className="bg-gray-600 text-white p-6 rounded-lg shadow hover:bg-gray-700 text-center"
        >
          <div className="text-2xl mb-2">📁</div>
          <div className="font-semibold">Ver Expedientes</div>
        </a>
        <a
          href="/reportes"
          className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 text-center"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold">Generar Reportes</div>
        </a>
      </div>
    </div>
  );
}
