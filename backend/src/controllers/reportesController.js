const { executeProcedure, sql } = require('../utils/dbHelpers');

const getRegistrosReport = async (req, res, next) => {
	try {
		const { fechaInicio, fechaFin, estado } = req.query;

		const result = await executeProcedure('sp_GetRegistrosReport', {
			FechaInicio: { type: sql.DateTime, value: fechaInicio || null },
			FechaFin: { type: sql.DateTime, value: fechaFin || null },
			Estado: { type: sql.VarChar(50), value: estado || null }
		});

		res.json({
			success: true,
			registros: result
		});
	} catch (error) {
		next(error);
	}
};

const getEstadisticas = async (req, res, next) => {
	try {
		const { fechaInicio, fechaFin } = req.query;

		const result = await executeProcedure('sp_GetEstadisticas', {
			FechaInicio: { type: sql.DateTime, value: fechaInicio || null },
			FechaFin: { type: sql.DateTime, value: fechaFin || null }
		});

		res.json({
			success: true,
			estadisticas: result[0]
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getRegistrosReport,
	getEstadisticas
};
