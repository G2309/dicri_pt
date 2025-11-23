const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dicri_secret_key_2025';

// Verifica el token JWT en el header
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Access token required' });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Invalid or expired token' });
		}
		
		req.user = user;
		next();
	});
};

// Middleware para verificar roles específicos
const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({
				error: 'Access denied. Insufficient permissions'
			});
		}
		next();
	};
};

module.exports = {
	authenticateToken,
	authorizeRoles,
	JWT_SECRET,
};
