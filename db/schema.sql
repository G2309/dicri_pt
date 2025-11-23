USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DICRI_DB')
BEGIN
    CREATE DATABASE DICRI_DB;
END
GO

USE DICRI_DB;
GO

IF OBJECT_ID('dbo.Indicios', 'U') IS NOT NULL DROP TABLE dbo.Indicios;
IF OBJECT_ID('dbo.Expedientes', 'U') IS NOT NULL DROP TABLE dbo.Expedientes;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE dbo.Expedientes (
    ExpedienteId INT IDENTITY(1,1) PRIMARY KEY,
    NumeroExpediente VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(500) NOT NULL,
    Ubicacion VARCHAR(255) NOT NULL,
    Estado VARCHAR(50) DEFAULT 'Borrador',
    TecnicoId INT NOT NULL,
    CoordinadorId INT NULL,
    Justificacion VARCHAR(1000) NULL,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    FechaRevision DATETIME NULL,
    FechaAprobacion DATETIME NULL,
    FOREIGN KEY (TecnicoId) REFERENCES dbo.Users(UserId),
    FOREIGN KEY (CoordinadorId) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.Indicios (
    IndicioId INT IDENTITY(1,1) PRIMARY KEY,
    ExpedienteId INT NOT NULL,
    Descripcion VARCHAR(500) NOT NULL,
    Color VARCHAR(50) NULL,
    Tamano VARCHAR(100) NULL,
    Peso DECIMAL(10, 2) NULL,
    Ubicacion VARCHAR(255) NOT NULL,
    TecnicoId INT NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ExpedienteId) REFERENCES dbo.Expedientes(ExpedienteId),
    FOREIGN KEY (TecnicoId) REFERENCES dbo.Users(UserId)
);
GO

CREATE INDEX IX_Expedientes_Estado ON dbo.Expedientes(Estado);
CREATE INDEX IX_Expedientes_TecnicoId ON dbo.Expedientes(TecnicoId);
CREATE INDEX IX_Expedientes_FechaRegistro ON dbo.Expedientes(FechaRegistro);
CREATE INDEX IX_Indicios_ExpedienteId ON dbo.Indicios(ExpedienteId);
GO
