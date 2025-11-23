const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const indiciosController = require('../controllers/indiciosController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validationMiddleware');
const { ROLES } = require('../config/constants');

const indicioValidation = [
	body('descripcion').notEmpty().trim().withMessage('Descripción requerida'),
	body('ubicacion').notEmpty().trim().withMessage('Ubicación requerida'),
	body('color').optional().trim(),
	body('tamano').optional().trim(),
	body('peso').optional().isDecimal().withMessage('Peso debe ser un número válido')
];

router.post('/:id/indicios', 
	authenticateToken,
	authorizeRoles(ROLES.TECNICO, ROLES.ADMIN),
	indicioValidation,
	validate,
	indiciosController.createIndicio
);

router.get('/:id/indicios', 
	authenticateToken,
	indiciosController.getIndiciosByExpediente
);

router.put('/indicios/:id', 
	authenticateToken,
	authorizeRoles(ROLES.TECNICO, ROLES.ADMIN),
	indicioValidation,
	validate,
	indiciosController.updateIndicio
);

router.delete('/indicios/:id', 
	authenticateToken,
	authorizeRoles(ROLES.TECNICO, ROLES.ADMIN),
	indiciosController.deleteIndicio
);

module.exports = router;
