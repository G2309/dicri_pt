const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const { authenticateToken } = require('../middleware/auth');

router.get('/registros', 
	authenticateToken,
	reportesController.getRegistrosReport
);

router.get('/estadisticas', 
	authenticateToken,
	reportesController.getEstadisticas
);

module.exports = router;
