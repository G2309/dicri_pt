jest.mock('../utils/dbHelpers', () => {
  return {
    executeProcedure: jest.fn(),
    sql: {
      VarChar: 'VarChar',
      Int: 'Int',
      DateTime: 'DateTime',
      Decimal: (p1, p2) => `Decimal(${p1},${p2})`
    }
  };
});

const { executeProcedure, sql } = require('../utils/dbHelpers');
const {
  createExpediente,
  getExpedientes,
  getExpedienteById,
  updateExpediente,
  submitForReview
} = require('../controllers/expedientesController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('expedientesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createExpediente', () => {
    it('debe crear un expediente y responder 201 con el expediente creado', async () => {
      const req = {
        body: {
          numeroExpediente: 'EXP-123',
          descripcion: 'Descripcion de prueba',
          ubicacion: 'Guatemala'
        },
        user: { userId: 42 }
      };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ ExpedienteId: 1, NumeroExpediente: 'EXP-123' }];
      executeProcedure.mockResolvedValue(dbResult);

      await createExpediente(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_CreateExpediente', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.NumeroExpediente.value).toBe(req.body.numeroExpediente);
      expect(params.Descripcion.value).toBe(req.body.descripcion);
      expect(params.Ubicacion.value).toBe(req.body.ubicacion);
      expect(params.TecnicoId.value).toBe(req.user.userId);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        expediente: dbResult[0]
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { body: {}, user: { userId: 1 } };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await createExpediente(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getExpedientes', () => {
    it('debe retornar expedientes desde la BD con query params', async () => {
      const req = { query: { estado: 'Abierto', fechaInicio: '2025-01-01', fechaFin: '2025-01-31', tecnicoId: '2' } };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ ExpedienteId: 1 }, { ExpedienteId: 2 }];
      executeProcedure.mockResolvedValue(dbResult);

      await getExpedientes(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_GetExpedientes', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.Estado.value).toBe('Abierto');
      expect(params.FechaInicio.value).toBe('2025-01-01');
      expect(params.FechaFin.value).toBe('2025-01-31');
      expect(params.TecnicoId.value).toBe('2');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        expedientes: dbResult
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { query: {} };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await getExpedientes(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getExpedienteById', () => {
    it('debe retornar expediente por id cuando existe', async () => {
      const req = { params: { id: '10' } };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ ExpedienteId: 10, NumeroExpediente: 'EXP-10' }];
      executeProcedure.mockResolvedValue(dbResult);

      await getExpedienteById(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_GetExpedienteById', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.ExpedienteId.value).toBe('10');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        expediente: dbResult[0]
      });
    });

    it('debe retornar 404 si no existe el expediente', async () => {
      const req = { params: { id: '99' } };
      const res = mockResponse();
      const next = jest.fn();

      executeProcedure.mockResolvedValue([]);

      await getExpedienteById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Expediente no encontrado' });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '1' } };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await getExpedienteById(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('updateExpediente', () => {
    it('debe actualizar un expediente y devolverlo', async () => {
      const req = {
        params: { id: '5' },
        body: { numeroExpediente: 'EXP-5', descripcion: 'Nueva', ubicacion: 'Zona 1' }
      };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ ExpedienteId: 5, NumeroExpediente: 'EXP-5' }];
      executeProcedure.mockResolvedValue(dbResult);

      await updateExpediente(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_UpdateExpediente', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.ExpedienteId.value).toBe('5');
      expect(params.NumeroExpediente.value).toBe('EXP-5');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        expediente: dbResult[0]
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '1' }, body: {} };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await updateExpediente(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('submitForReview', () => {
    it('debe enviar a revisión y devolver mensaje y expediente', async () => {
      const req = { params: { id: '2' } };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ ExpedienteId: 2, Estado: 'EnRevision' }];
      executeProcedure.mockResolvedValue(dbResult);

      await submitForReview(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_SubmitForReview', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.ExpedienteId.value).toBe('2');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Expediente enviado a revisión',
        expediente: dbResult[0]
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '2' } };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await submitForReview(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
