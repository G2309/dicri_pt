const sql = require('mssql');

const config = {
	user: process.env.DB_USER || 'sa',
	password: process.env.DB_PASSWORD,
	server: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'DICRI_DB',
	options: {
		encrypt: false,
		trustServerCertificate: true,
		enableArithAbort: true,
	},
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
};

let poolPromise;

const getPool = async () => {
	if (!poolPromise) {
		poolPromise = sql.connect(config);
	}
	return poolPromise;
};

module.exports = {
	sql,
	getPool,
};
