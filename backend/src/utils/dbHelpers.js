const { sql, getPool } = require('../config/database');

// Ejecuta un stored procedure y retorna el recordset
const executeProcedure = async (procedureName, params = {}) => {
	try {
		const pool = await getPool();
		const request = pool.request();

		// Agregar parámetros de entrada
		Object.entries(params).forEach(([key, value]) => {
			if (value.type && value.value !== undefined) {
				request.input(key, value.type, value.value);
			} else {
				request.input(key, value);
			}
		});

		const result = await request.execute(procedureName);
		return result.recordset;
	} catch (error) {
		console.error(`Error executing procedure ${procedureName}:`, error);
		throw error;
	}
};

// Ejecuta un stored procedure con parámetros de salida
const executeProcedureWithOutput = async (procedureName, inputs = {}, outputs = {}) => {
	try {
		const pool = await getPool();
		const request = pool.request();

		// Agregar parámetros de entrada
		Object.entries(inputs).forEach(([key, value]) => {
			request.input(key, value.type, value.value);
		});

		// Agregar parámetros de salida
		Object.entries(outputs).forEach(([key, value]) => {
			request.output(key, value.type);
		});

		const result = await request.execute(procedureName);

		return {
			recordset: result.recordset,
			output: result.output,
		};
	} catch (error) {
		console.error(`Error executing procedure ${procedureName}:`, error);
		throw error;
	}
};

module.exports = {
	executeProcedure,
	executeProcedureWithOutput,
	sql,
};
