const { executeProcedure, sql } = require('../utils/dbHelpers');

const getPendingExpedientes = async (req, res, next) => {
	try {
		const result = await executeProcedure('sp_GetPendingExpedientes');

		res.json({
			success: true,
			expedientes: result
		});
	} catch (error) {
		next(error);
	}
};

const approveExpediente = async (req, res, next) => {
	try {
		const { id } = req.params;
		const coordinadorId = req.user.userId;

		const result = await executeProcedure('sp_ApproveExpediente', {
			ExpedienteId: { type: sql.Int, value: id },
			CoordinadorId: { type: sql.Int, value: coordinadorId }
		});

		res.json({
			success: true,
			message: 'Expediente aprobado correctamente',
			expediente: result[0]
		});
	} catch (error) {
		next(error);
	}
};

const rejectExpediente = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { justificacion } = req.body;
		const coordinadorId = req.user.userId;

		if (!justificacion || justificacion.trim().length === 0) {
			return res.status(400).json({
				error: 'La justificación es requerida para rechazar un expediente'
			});
		}

		const result = await executeProcedure('sp_RejectExpediente', {
			ExpedienteId: { type: sql.Int, value: id },
			CoordinadorId: { type: sql.Int, value: coordinadorId },
			Justificacion: { type: sql.VarChar(1000), value: justificacion }
		});

		res.json({
			success: true,
			message: 'Expediente rechazado',
			expediente: result[0]
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getPendingExpedientes,
	approveExpediente,
	rejectExpediente
};
