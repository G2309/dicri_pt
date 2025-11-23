USE DICRI_DB;
GO

INSERT INTO dbo.Users (Username, Password, FullName, Role) VALUES
('admin', 'admin123', 'Administrador Sistema', 'Administrador'),
('coordinador1', 'coord123', 'Juan Pérez Coordinador', 'Coordinador'),
('tecnico1', 'tecnico123', 'María García Técnico', 'Técnico'),
('tecnico2', 'tecnico123', 'Carlos López Técnico', 'Técnico');
GO
