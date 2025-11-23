'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { expedientes, indicios, auth } from '@/app/lib/api';

export default function ExpedienteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [expediente, setExpediente] = useState(null);
  const [indiciosList, setIndiciosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIndicioForm, setShowIndicioForm] = useState(false);
  const [indicioForm, setIndicioForm] = useState({
    descripcion: '',
    color: '',
    tamano: '',
    peso: '',
    ubicacion: '',
  });
  const user = auth.getCurrentUser();

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const [expData, indiciosData] = await Promise.all([
        expedientes.getById(params.id),
        indicios.getByExpediente(params.id),
      ]);
      setExpediente(expData.expediente);
      setIndiciosList(indiciosData.indicios);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIndicio = async (e) => {
    e.preventDefault();
    try {
      await indicios.create(params.id, indicioForm);
      setIndicioForm({ descripcion: '', color: '', tamano: '', peso: '', ubicacion: '' });
      setShowIndicioForm(false);
      loadData();
    } catch (error) {
      alert('Error al crear indicio: ' + error.message);
    }
  };

  const handleDeleteIndicio = async (id) => {
    if (!confirm('¿Está seguro de eliminar este indicio?')) return;
    try {
      await indicios.delete(id);
      loadData();
    } catch (error) {
      alert('Error al eliminar indicio: ' + error.message);
    }
  };

  const handleSubmitForReview = async () => {
    if (!confirm('¿Enviar expediente a revisión?')) return;
    try {
      await expedientes.submitForReview(params.id);
      loadData();
    } catch (error) {
      alert('Error al enviar a revisión: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!expediente) {
    return <div className="text-center py-8">Expediente no encontrado</div>;
  }

  const canEdit = expediente.Estado === 'Borrador' && 
    (user?.role === 'Técnico' || user?.role === 'Administrador');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-2">
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{expediente.NumeroExpediente}</h1>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            expediente.Estado === 'Aprobado'
              ? 'bg-green-100 text-green-800'
              : expediente.Estado === 'Rechazado'
              ? 'bg-red-100 text-red-800'
              : expediente.Estado === 'En Revisión'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {expediente.Estado}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Descripción</div>
            <div className="font-medium">{expediente.Descripcion}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Ubicación</div>
            <div className="font-medium">{expediente.Ubicacion}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Técnico</div>
            <div className="font-medium">{expediente.TecnicoNombre}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Fecha de Registro</div>
            <div className="font-medium">
              {new Date(expediente.FechaRegistro).toLocaleDateString()}
            </div>
          </div>
          {expediente.CoordinadorNombre && (
            <div>
              <div className="text-sm text-gray-600">Coordinador</div>
              <div className="font-medium">{expediente.CoordinadorNombre}</div>
            </div>
          )}
          {expediente.Justificacion && (
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600">Justificación de Rechazo</div>
              <div className="font-medium text-red-600">{expediente.Justificacion}</div>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleSubmitForReview}
              disabled={indiciosList.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Enviar a Revisión
            </button>
            {indiciosList.length === 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Debe agregar al menos un indicio antes de enviar a revisión
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Indicios ({indiciosList.length})</h2>
          {canEdit && (
            <button
              onClick={() => setShowIndicioForm(!showIndicioForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Agregar Indicio
            </button>
          )}
        </div>

        {showIndicioForm && (
          <div className="p-6 border-b bg-gray-50">
            <form onSubmit={handleCreateIndicio} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Descripción *</label>
                  <textarea
                    value={indicioForm.descripcion}
                    onChange={(e) =>
                      setIndicioForm({ ...indicioForm, descripcion: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <input
                    type="text"
                    value={indicioForm.color}
                    onChange={(e) => setIndicioForm({ ...indicioForm, color: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tamaño</label>
                  <input
                    type="text"
                    value={indicioForm.tamano}
                    onChange={(e) => setIndicioForm({ ...indicioForm, tamano: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Peso</label>
                  <input
                    type="number"
                    step="0.01"
                    value={indicioForm.peso}
                    onChange={(e) => setIndicioForm({ ...indicioForm, peso: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ubicación *</label>
                  <input
                    type="text"
                    value={indicioForm.ubicacion}
                    onChange={(e) => setIndicioForm({ ...indicioForm, ubicacion: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIndicioForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar Indicio
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-6">
          {indiciosList.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay indicios registrados</p>
          ) : (
            <div className="space-y-4">
              {indiciosList.map((indicio) => (
                <div key={indicio.IndicioId} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{indicio.Descripcion}</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                        {indicio.Color && <div>Color: {indicio.Color}</div>}
                        {indicio.Tamano && <div>Tamaño: {indicio.Tamano}</div>}
                        {indicio.Peso && <div>Peso: {indicio.Peso} kg</div>}
                        <div>Ubicación: {indicio.Ubicacion}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Registrado por {indicio.TecnicoNombre} el{' '}
                        {new Date(indicio.FechaRegistro).toLocaleDateString()}
                      </div>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteIndicio(indicio.IndicioId)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Eliminar
                      </button>
                    )}
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
