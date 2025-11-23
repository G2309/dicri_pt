const { executeProcedure, sql } = require('../utils/dbHelpers');

const createExpediente = async (req, res, next) => {
	try {
		const { numeroExpediente, descripcion, ubicacion } = req.body;
		const tecnicoId = req.user.userId;

		const result = await executeProcedure('sp_CreateExpediente', {
			NumeroExpediente: { type: sql.VarChar(50), value: numeroExpediente },
			Descripcion: { type: sql.VarChar(500), value: descripcion },
			Ubicacion: { type: sql.VarChar(255), value: ubicacion },
			TecnicoId: { type: sql.Int, value: tecnicoId }
		});

		res.status(201).json({
			success: true,
			expediente: result[0]
		});
	} catch (error) {
		next(error);
	}
};

const getExpedientes = async (req, res, next) => {
	try {
		const { estado, fechaInicio, fechaFin, tecnicoId } = req.query;

		const result = await executeProcedure('sp_GetExpedientes', {
			Estado: { type: sql.VarChar(50), value: estado || null },
			FechaInicio: { type: sql.DateTime, value: fechaInicio || null },
			FechaFin: { type: sql.DateTime, value: fechaFin || null },
			TecnicoId: { type: sql.Int, value: tecnicoId || null }
		});

		res.json({
			success: true,
			expedientes: result
		});
	} catch (error) {
		next(error);
	}
};

const getExpedienteById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const result = await executeProcedure('sp_GetExpedienteById', {
			ExpedienteId: { type: sql.Int, value: id }
		});

		if (!result || result.length === 0) {
			return res.status(404).json({ error: 'Expediente no encontrado' });
		}

		res.json({
			success: true,
			expediente: result[0]
		});
	} catch (error) {
		next(error);
	}
};

const updateExpediente = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { numeroExpediente, descripcion, ubicacion } = req.body;

		const result = await executeProcedure('sp_UpdateExpediente', {
			ExpedienteId: { type: sql.Int, value: id },
			NumeroExpediente: { type: sql.VarChar(50), value: numeroExpediente },
			Descripcion: { type: sql.VarChar(500), value: descripcion },
			Ubicacion: { type: sql.VarChar(255), value: ubicacion }
		});

		res.json({
			success: true,
			expediente: result[0]
		});
	} catch (error) {
		next(error);
	}
};

const submitForReview = async (req, res, next) => {
	try {
		const { id } = req.params;

		const result = await executeProcedure('sp_SubmitForReview', {
			ExpedienteId: { type: sql.Int, value: id }
		});

		res.json({
			success: true,
			message: 'Expediente enviado a revisión',
			expediente: result[0]
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createExpediente,
	getExpedientes,
	getExpedienteById,
	updateExpediente,
	submitForReview
};
