const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		message: 'DICRI Backend API running',
		timestamp: new Date().toISOString(),
	});
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
