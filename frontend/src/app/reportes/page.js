'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { reportes, auth } from '@/app/lib/api';

export default function ReportesPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
  });
  const [loading, setLoading] = useState(true);
  const user = auth.getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, registrosData] = await Promise.all([
        reportes.getEstadisticas(filters),
        reportes.getRegistros(filters),
      ]);
      setStats(statsData.estadisticas);
      setRegistros(registrosData.registros);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    loadData();
  };

  const handleClearFilters = () => {
    setFilters({ fechaInicio: '', fechaFin: '', estado: '' });
    setTimeout(() => {
      setLoading(true);
      loadData();
    }, 100);
  };

  const handleExportCSV = () => {
    const headers = [
      'Número Expediente',
      'Descripción',
      'Estado',
      'Técnico',
      'Coordinador',
      'Fecha Registro',
      'Indicios',
    ];
    const rows = registros.map((r) => [
      r.NumeroExpediente,
      r.Descripcion,
      r.Estado,
      r.TecnicoNombre,
      r.CoordinadorNombre || '',
      new Date(r.FechaRegistro).toLocaleDateString(),
      r.TotalIndicios,
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-dicri-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center text-gray-600">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Dashboard
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Todos</option>
                  <option value="Borrador">Borrador</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleFilter}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Filtrar
                </button>
                <button
                  onClick={handleClearFilters}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-gray-600 text-sm mb-2">Total Expedientes</div>
              <div className="text-4xl font-bold text-gray-800">{stats?.TotalExpedientes || 0}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
              <div className="text-gray-600 text-sm mb-2">Borradores</div>
              <div className="text-4xl font-bold text-gray-700">{stats?.TotalBorradores || 0}</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow text-center">
              <div className="text-blue-600 text-sm mb-2">En Revisión</div>
              <div className="text-4xl font-bold text-blue-700">{stats?.TotalEnRevision || 0}</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow text-center">
              <div className="text-green-600 text-sm mb-2">Aprobados</div>
              <div className="text-4xl font-bold text-green-700">{stats?.TotalAprobados || 0}</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow text-center">
              <div className="text-red-600 text-sm mb-2">Rechazados</div>
              <div className="text-4xl font-bold text-red-700">{stats?.TotalRechazados || 0}</div>
            </div>
          </div>

          {/* Tabla de registros */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Registros ({registros.length})</h2>
              <button
                onClick={handleExportCSV}
                disabled={registros.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              {registros.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No hay registros</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Técnico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Coordinador
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Indicios
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registros.map((reg) => (
                      <tr key={reg.ExpedienteId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {reg.NumeroExpediente}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.Descripcion}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reg.Estado === 'Aprobado'
                                ? 'bg-green-100 text-green-800'
                                : reg.Estado === 'Rechazado'
                                ? 'bg-red-100 text-red-800'
                                : reg.Estado === 'En Revisión'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {reg.Estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.TecnicoNombre}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {reg.CoordinadorNombre || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(reg.FechaRegistro).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          {reg.TotalIndicios}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
