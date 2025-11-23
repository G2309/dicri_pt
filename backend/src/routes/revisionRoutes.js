const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const revisionController = require('../controllers/revisionController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validationMiddleware');
const { ROLES } = require('../config/constants');

router.get('/pendientes', 
	authenticateToken,
	authorizeRoles(ROLES.COORDINADOR, ROLES.ADMIN),
	revisionController.getPendingExpedientes
);

router.post('/:id/aprobar', 
	authenticateToken,
	authorizeRoles(ROLES.COORDINADOR, ROLES.ADMIN),
	revisionController.approveExpediente
);

router.post('/:id/rechazar', 
	authenticateToken,
	authorizeRoles(ROLES.COORDINADOR, ROLES.ADMIN),
	[
		body('justificacion').notEmpty().trim().withMessage('Justificación requerida')
	],
	validate,
	revisionController.rejectExpediente
);

module.exports = router;
