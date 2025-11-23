const errorHandler = (err, req, res, next) => {
	console.error('Error:', err);

	// error de SQL Server

	if (err.name === 'RequestError') {
		return res.status(400).json({
			error: 'Database error',
			message: err.message,
		});
	}

	// Error de validación
  
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			error: 'Validation error',
			message: err.message,
    	});
	}

	// Error genérico
	res.status(err.status || 500).json({
		error: err.message || 'Internal server error',
	});
};

module.exports = errorHandler
