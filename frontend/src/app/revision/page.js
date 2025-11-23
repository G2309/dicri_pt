'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { revision, indicios } from '@/app/lib/api';

export default function RevisionPage() {
  const router = useRouter();
  const [pending, setPending] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [indiciosList, setIndiciosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [justificacion, setJustificacion] = useState('');

  // Cargar expedientes pendientes
  useEffect(() => {
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

  // Ver detalle de expediente
  const handleViewDetail = async (exp) => {
    setSelectedExp(exp);
    try {
      const response = await indicios.getByExpediente(exp.ExpedienteId);
      setIndiciosList(response.indicios);
    } catch (error) {
      console.error('Error cargando indicios:', error);
    }
  };

  // Aprobar expediente
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

  // Rechazar expediente
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
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Revisión de Expedientes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de expedientes pendientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
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
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedExp?.ExpedienteId === exp.ExpedienteId
                        ? 'border-blue-500 bg-blue-50'
                        : ''
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
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Detalle del Expediente</h2>
          </div>
          <div className="p-6">
            {!selectedExp ? (
              <p className="text-center text-gray-500 py-8">
                Seleccione un expediente para revisar
              </p>
            ) : (
              <div className="space-y-6">
                {/* Información general */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">{selectedExp.NumeroExpediente}</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Descripción:</span>
                      <p className="font-medium">{selectedExp.Descripcion}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ubicación:</span>
                      <p className="font-medium">{selectedExp.Ubicacion}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Técnico:</span>
                      <p className="font-medium">{selectedExp.TecnicoNombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha de Registro:</span>
                      <p className="font-medium">
                        {new Date(selectedExp.FechaRegistro).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de indicios */}
                <div>
                  <h4 className="font-semibold mb-3">Indicios Registrados</h4>
                  {indiciosList.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay indicios</p>
                  ) : (
                    <div className="space-y-3">
                      {indiciosList.map((indicio) => (
                        <div key={indicio.IndicioId} className="border rounded p-3 text-sm">
                          <div className="font-medium">{indicio.Descripcion}</div>
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

                {/* Formulario de rechazo */}
                {showRejectForm ? (
                  <form onSubmit={handleReject} className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Justificación del Rechazo *
                      </label>
                      <textarea
                        value={justificacion}
                        onChange={(e) => setJustificacion(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Explique las razones del rechazo..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Confirmar Rechazo
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-2 border-t pt-4">
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={handleApprove}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
  );
}
