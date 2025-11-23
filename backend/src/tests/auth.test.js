jest.resetModules();

const dbHelpersPath = require.resolve('../utils/dbHelpers');
jest.doMock(dbHelpersPath, () => ({
  executeProcedure: jest.fn(),
  sql: {
    VarChar: 'VarChar',
    Int: 'Int',
    DateTime: 'DateTime',
    Decimal: (p, q) => 'Decimal'
  }
}));

const jwtPath = require.resolve('jsonwebtoken');
jest.doMock(jwtPath, () => ({
  sign: jest.fn(() => 'fake-token')
}));

const { createRes, createNext } = require('./__mocks__/httpMocks');

const { executeProcedure } = require(dbHelpersPath);
const jwt = require(jwtPath);
const authController = require('../controllers/authController');

describe('Auth controller - login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('400 si falta username o password', async () => {
    const req = { body: {} };
    const res = createRes();
    const next = createNext();

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });

  test('401 si credenciales inválidas', async () => {
    executeProcedure.mockResolvedValueOnce([]); // stored proc devuelve vacío
    const req = { body: { username: 'x', password: 'y' } };
    const res = createRes();
    const next = createNext();

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid credentials' }));
  });

  test('login exitoso devuelve token y user', async () => {
    const fakeUser = { UserId: 1, Username: 'tecnico1', FullName: 'T', Role: 'Técnico' };
    executeProcedure.mockResolvedValueOnce([fakeUser]);

    const req = { body: { username: 'tecnico1', password: 'tecnico123' } };
    const res = createRes();
    const next = createNext();

    await authController.login(req, res, next);

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      token: 'fake-token',
      user: expect.objectContaining({ userId: 1, username: 'tecnico1' })
    }));
  });
});
