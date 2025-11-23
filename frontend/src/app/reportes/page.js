'use client';

import { useEffect, useState } from 'react';
import { reportes } from '@/app/lib/api';

export default function ReportesPage() {
  const [stats, setStats] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
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

  // Aplicar filtros
  const handleFilter = () => {
    setLoading(true);
    loadData();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({ fechaInicio: '', fechaFin: '', estado: '' });
    setTimeout(() => {
      setLoading(true);
      loadData();
    }, 100);
  };

  // Exportar a CSV
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
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={filters.fechaInicio}
              onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha Fin</label>
            <input
              type="date"
              value={filters.fechaFin}
              onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
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
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Filtrar
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Registros ({registros.length})</h2>
          <button
            onClick={handleExportCSV}
            disabled={registros.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {registros.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hay registros</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
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
  );
}
