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
  createIndicio,
  getIndiciosByExpediente,
  updateIndicio,
  deleteIndicio
} = require('../controllers/indiciosController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('indiciosController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createIndicio', () => {
    it('debe crear un indicio y devolver 201 con el indicio creado', async () => {
      const req = {
        params: { id: '7' }, // id del expediente
        body: {
          descripcion: 'Huella',
          color: 'Marron',
          tamano: 'Pequeño',
          peso: 1.23,
          ubicacion: 'Escena'
        },
        user: { userId: 99 }
      };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ IndicioId: 11, Descripcion: 'Huella' }];
      executeProcedure.mockResolvedValue(dbResult);

      await createIndicio(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_CreateIndicio', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.ExpedienteId.value).toBe('7');
      expect(params.Descripcion.value).toBe('Huella');
      expect(params.Color.value).toBe('Marron');
      expect(params.Peso.value).toBe(1.23);
      expect(params.TecnicoId.value).toBe(99);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        indicio: dbResult[0]
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '1' }, body: {}, user: { userId: 1 } };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await createIndicio(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getIndiciosByExpediente', () => {
    it('debe retornar la lista de indicios', async () => {
      const req = { params: { id: '7' } };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ IndicioId: 1 }, { IndicioId: 2 }];
      executeProcedure.mockResolvedValue(dbResult);

      await getIndiciosByExpediente(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_GetIndiciosByExpediente', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.ExpedienteId.value).toBe('7');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        indicios: dbResult
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '1' } };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await getIndiciosByExpediente(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('updateIndicio', () => {
    it('debe actualizar el indicio y devolverlo', async () => {
      const req = {
        params: { id: '3' },
        body: { descripcion: 'Actualizado', color: 'Rojo', tamano: 'Mediano', peso: 2.5, ubicacion: 'Caja' }
      };
      const res = mockResponse();
      const next = jest.fn();

      const dbResult = [{ IndicioId: 3 }];
      executeProcedure.mockResolvedValue(dbResult);

      await updateIndicio(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_UpdateIndicio', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.IndicioId.value).toBe('3');
      expect(params.Descripcion.value).toBe('Actualizado');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        indicio: dbResult[0]
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '3' }, body: {} };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await updateIndicio(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('deleteIndicio', () => {
    it('debe eliminar el indicio y devolver mensaje de éxito', async () => {
      const req = { params: { id: '4' } };
      const res = mockResponse();
      const next = jest.fn();

      executeProcedure.mockResolvedValue(); // no se espera resultado

      await deleteIndicio(req, res, next);

      expect(executeProcedure).toHaveBeenCalledWith('sp_DeleteIndicio', expect.any(Object));
      const params = executeProcedure.mock.calls[0][1];
      expect(params.IndicioId.value).toBe('4');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Indicio eliminado correctamente'
      });
    });

    it('debe pasar el error a next si executeProcedure lanza', async () => {
      const req = { params: { id: '4' } };
      const res = mockResponse();
      const next = jest.fn();

      const err = new Error('DB error');
      executeProcedure.mockRejectedValue(err);

      await deleteIndicio(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});

