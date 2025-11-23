const jwt = require('jsonwebtoken');
const { executeProcedure, sql } = require('../utils/dbHelpers');
const { JWT_SECRET } = require('../middleware/auth');

// Login de usuario
const login = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				error: 'Username and password are required'
			});
		}

		// Llamar stored procedure de autenticación
		const result = await executeProcedure('sp_AuthenticateUser', {
			Username: { type: sql.VarChar(50), value: username },
			Password: { type: sql.VarChar(255), value: password },
		});

		if (!result || result.length === 0) {
			return res.status(401).json({
				error: 'Invalid credentials'
			});
		}

		const user = result[0];

		// Generar JWT token
		const token = jwt.sign(
			{
				userId: user.UserId,
				username: user.Username,
				role: user.Role,
				fullName: user.FullName,
			},
			JWT_SECRET,
			{ expiresIn: '8h' }
		);

		res.json({
			success: true,
			token,
			user: {
				userId: user.UserId,
				username: user.Username,
				fullName: user.FullName,
				role: user.Role,
			},
		});
	} catch (error) {
		next(error);
	}
};

// Obtener información del usuario actual
const getCurrentUser = async (req, res, next) => {
	try {
		const result = await executeProcedure('sp_GetUserById', {
			UserId: { type: sql.Int, value: req.user.userId },
		});

		if (!result || result.length === 0) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json({
			success: true,
			user: result[0],
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	login,
	getCurrentUser,
};
