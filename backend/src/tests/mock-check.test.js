
const dbHelpersPath = require.resolve('../utils/dbHelpers');

jest.resetModules(); // asegura un módulo limpio
jest.doMock(dbHelpersPath, () => ({
  executeProcedure: jest.fn(),
}));

test('mock-check: executeProcedure should be a mocked function', () => {
  const db = require(dbHelpersPath);
  expect(typeof db.executeProcedure).toBe('function');
  db.executeProcedure('X');
  expect(db.executeProcedure).toHaveBeenCalledWith('X');
});
