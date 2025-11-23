const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const expedientesController = require('../controllers/expedientesController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validationMiddleware');
const { ROLES } = require('../config/constants');

const expedienteValidation = [
	body('numeroExpediente').notEmpty().trim().withMessage('Número de expediente requerido'),
	body('descripcion').notEmpty().trim().withMessage('Descripción requerida'),
	body('ubicacion').notEmpty().trim().withMessage('Ubicación requerida')
];

router.post('/', 
	authenticateToken,
	authorizeRoles(ROLES.TECNICO, ROLES.ADMIN),
	expedienteValidation,
	validate,
	expedientesController.createExpediente
);

router.get('/', 
	authenticateToken,
	expedientesController.getExpedientes
);

router.get('/:id', 
	authenticateToken,
	expedientesController.getExpedienteById
);

router.put('/:id', 
	authenticateToken,
	authorizeRoles(ROLES.TECNICO, ROLES.ADMIN),
	expedienteValidation,
	validate,
	expedientesController.updateExpediente
);

router.post('/:id/revision', 
	authenticateToken,
	authorizeRoles(ROLES.TECNICO, ROLES.ADMIN),
	expedientesController.submitForReview
);

module.exports = router;
