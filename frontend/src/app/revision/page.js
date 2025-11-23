'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { revision, indicios, auth } from '@/app/lib/api';

export default function RevisionPage() {
  const router = useRouter();
  const [pending, setPending] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [indiciosList, setIndiciosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [justificacion, setJustificacion] = useState('');
  const user = auth.getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Solo coordinadores y admins pueden revisar
    if (user.role !== 'Coordinador' && user.role !== 'Administrador') {
      router.push('/dashboard');
      return;
    }
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const response = await revision.getPending();
      setPending(response.expedientes);
    } catch (error) {
      console.error('Error cargando expedientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (exp) => {
    setSelectedExp(exp);
    try {
      const response = await indicios.getByExpediente(exp.ExpedienteId);
      setIndiciosList(response.indicios);
    } catch (error) {
      console.error('Error cargando indicios:', error);
    }
  };

  const handleApprove = async () => {
    if (!confirm('¿Aprobar este expediente?')) return;
    try {
      await revision.approve(selectedExp.ExpedienteId);
      alert('Expediente aprobado correctamente');
      setSelectedExp(null);
      loadPending();
    } catch (error) {
      alert('Error al aprobar: ' + error.message);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      await revision.reject(selectedExp.ExpedienteId, justificacion);
      alert('Expediente rechazado');
      setShowRejectForm(false);
      setJustificacion('');
      setSelectedExp(null);
      loadPending();
    } catch (error) {
      alert('Error al rechazar: ' + error.message);
    }
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
            <h1 className="text-3xl font-bold text-gray-800">Revisión de Expedientes</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de expedientes pendientes */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Pendientes de Revisión ({pending.length})
                </h2>
              </div>
              <div className="p-6">
                {pending.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay expedientes pendientes de revisión
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pending.map((exp) => (
                      <div
                        key={exp.ExpedienteId}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedExp?.ExpedienteId === exp.ExpedienteId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleViewDetail(exp)}
                      >
                        <div className="font-semibold text-gray-800">{exp.NumeroExpediente}</div>
                        <div className="text-sm text-gray-600 mt-1">{exp.Descripcion}</div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            Técnico: {exp.TecnicoNombre}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {exp.TotalIndicios} indicios
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detalle del expediente seleccionado */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Detalle del Expediente</h2>
              </div>
              <div className="p-6">
                {!selectedExp ? (
                  <p className="text-center text-gray-500 py-8">
                    Seleccione un expediente para revisar
                  </p>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">{selectedExp.NumeroExpediente}</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Descripción:</span>
                          <p className="font-medium text-gray-900">{selectedExp.Descripcion}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Ubicación:</span>
                          <p className="font-medium text-gray-900">{selectedExp.Ubicacion}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Técnico:</span>
                          <p className="font-medium text-gray-900">{selectedExp.TecnicoNombre}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fecha de Registro:</span>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedExp.FechaRegistro).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Indicios Registrados</h4>
                      {indiciosList.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay indicios</p>
                      ) : (
                        <div className="space-y-3">
                          {indiciosList.map((indicio) => (
                            <div key={indicio.IndicioId} className="border border-gray-200 rounded p-3 text-sm">
                              <div className="font-medium text-gray-900">{indicio.Descripcion}</div>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                                {indicio.Color && <div>Color: {indicio.Color}</div>}
                                {indicio.Tamano && <div>Tamaño: {indicio.Tamano}</div>}
                                {indicio.Peso && <div>Peso: {indicio.Peso} kg</div>}
                                <div>Ubicación: {indicio.Ubicacion}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {showRejectForm ? (
                      <form onSubmit={handleReject} className="space-y-4 border-t border-gray-200 pt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Justificación del Rechazo *
                          </label>
                          <textarea
                            value={justificacion}
                            onChange={(e) => setJustificacion(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                            placeholder="Explique las razones del rechazo..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRejectForm(false)}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Confirmar Rechazo
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex gap-2 border-t border-gray-200 pt-4">
                        <button
                          onClick={() => setShowRejectForm(true)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={handleApprove}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Aprobar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
