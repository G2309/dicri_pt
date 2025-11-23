// helper simple para crear res y spyear status/json
function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

function createNext() {
  return jest.fn();
}

module.exports = { createRes, createNext };

