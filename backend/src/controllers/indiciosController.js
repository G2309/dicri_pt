const { executeProcedure, sql } = require('../utils/dbHelpers');

const createIndicio = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { descripcion, color, tamano, peso, ubicacion } = req.body;
		const tecnicoId = req.user.userId;

		const result = await executeProcedure('sp_CreateIndicio', {
			ExpedienteId: { type: sql.Int, value: id },
			Descripcion: { type: sql.VarChar(500), value: descripcion },
			Color: { type: sql.VarChar(50), value: color || null },
			Tamano: { type: sql.VarChar(100), value: tamano || null },
			Peso: { type: sql.Decimal(10, 2), value: peso || null },
			Ubicacion: { type: sql.VarChar(255), value: ubicacion },
			TecnicoId: { type: sql.Int, value: tecnicoId }
		});

		res.status(201).json({
			success: true,
			indicio: result[0]
		});
	} catch (error) {
		next(error);
	}
};

const getIndiciosByExpediente = async (req, res, next) => {
	try {
		const { id } = req.params;

		const result = await executeProcedure('sp_GetIndiciosByExpediente', {
			ExpedienteId: { type: sql.Int, value: id }
		});

		res.json({
			success: true,
			indicios: result
		});
	} catch (error) {
		next(error);
	}
};

const updateIndicio = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { descripcion, color, tamano, peso, ubicacion } = req.body;

		const result = await executeProcedure('sp_UpdateIndicio', {
			IndicioId: { type: sql.Int, value: id },
			Descripcion: { type: sql.VarChar(500), value: descripcion },
			Color: { type: sql.VarChar(50), value: color || null },
			Tamano: { type: sql.VarChar(100), value: tamano || null },
			Peso: { type: sql.Decimal(10, 2), value: peso || null },
			Ubicacion: { type: sql.VarChar(255), value: ubicacion }
		});

		res.json({
			success: true,
			indicio: result[0]
		});
	} catch (error) {
		next(error);
	}
};

const deleteIndicio = async (req, res, next) => {
	try {
		const { id } = req.params;

		await executeProcedure('sp_DeleteIndicio', {
			IndicioId: { type: sql.Int, value: id }
		});

		res.json({
			success: true,
			message: 'Indicio eliminado correctamente'
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createIndicio,
	getIndiciosByExpediente,
	updateIndicio,
	deleteIndicio
};
