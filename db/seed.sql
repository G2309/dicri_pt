USE DICRI_DB;
GO

INSERT INTO dbo.Users (Username, Password, FullName, Role) VALUES
('admin', 'admin123', 'Gustavo Cruz', 'Administrador'),
('coordinador1', 'coord123', 'Juan Pérez Coordinador', 'Coordinador'),
('tecnico1', 'tecnico123', 'María García Técnico', 'Técnico'),
('tecnico2', 'tecnico123', 'Carlos López Técnico', 'Técnico');
GO

INSERT INTO dbo.Expedientes (NumeroExpediente, Descripcion, Ubicacion, Estado, TecnicoId, CoordinadorId, Justificacion)
VALUES
('EXP-2025-001', 'Homicidio en zona 5', 'Bodega 3', 'Borrador', 3, NULL, NULL),
('EXP-2025-002', 'Robo de vehículo', 'Bodega 1', 'En Revisión', 4, 2, NULL),
('EXP-2025-003', 'Incendio en vivienda', 'Bodega 2', 'Aprobado', 3, 2, NULL),
('EXP-2025-004', 'Allanamiento zona 18', 'Bodega 4', 'Rechazado', 4, 2, 'Mala documentación');
GO

INSERT INTO dbo.Indicios (ExpedienteId, Descripcion, Color, Tamano, Peso, Ubicacion, TecnicoId)
VALUES
(1, 'Mancha de sangre en pared', 'Rojo oscuro', '10x5 cm', 0.0, 'Habitación principal', 3),
(1, 'Casquillo de bala 9mm', 'Dorado', 'Pequeño', 0.02, 'Sala', 3),

(2, 'Vidrio roto', 'Transparente', 'Pequeño', 0.01, 'Cerca del vehículo', 4),
(2, 'Huella dactilar parcial', NULL, NULL, 0.0, 'Puerta del conductor', 4),

(3, 'Restos de madera quemada', 'Negro', 'Mediano', 0.5, 'Sala principal', 3),

(4, 'Documentos incompletos', NULL, NULL, 0.1, 'Archivo físico', 4);
GO
