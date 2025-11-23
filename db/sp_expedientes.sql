USE DICRI_DB;
GO

IF OBJECT_ID('dbo.sp_CreateExpediente', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_CreateExpediente;
GO

CREATE PROCEDURE dbo.sp_CreateExpediente
    @NumeroExpediente VARCHAR(50),
    @Descripcion VARCHAR(500),
    @Ubicacion VARCHAR(255),
    @TecnicoId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.Expedientes (NumeroExpediente, Descripcion, Ubicacion, TecnicoId, Estado)
    VALUES (@NumeroExpediente, @Descripcion, @Ubicacion, @TecnicoId, 'Borrador');
    
    SELECT 
        ExpedienteId,
        NumeroExpediente,
        Descripcion,
        Ubicacion,
        Estado,
        TecnicoId,
        FechaRegistro
    FROM dbo.Expedientes
    WHERE ExpedienteId = SCOPE_IDENTITY();
END
GO

IF OBJECT_ID('dbo.sp_GetExpedientes', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetExpedientes;
GO

CREATE PROCEDURE dbo.sp_GetExpedientes
    @Estado VARCHAR(50) = NULL,
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL,
    @TecnicoId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Descripcion,
        e.Ubicacion,
        e.Estado,
        e.TecnicoId,
        t.FullName AS TecnicoNombre,
        e.CoordinadorId,
        c.FullName AS CoordinadorNombre,
        e.Justificacion,
        e.FechaRegistro,
        e.FechaRevision,
        e.FechaAprobacion,
        (SELECT COUNT(*) FROM dbo.Indicios WHERE ExpedienteId = e.ExpedienteId) AS TotalIndicios
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users t ON e.TecnicoId = t.UserId
    LEFT JOIN dbo.Users c ON e.CoordinadorId = c.UserId
    WHERE (@Estado IS NULL OR e.Estado = @Estado)
        AND (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
        AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)
        AND (@TecnicoId IS NULL OR e.TecnicoId = @TecnicoId)
    ORDER BY e.FechaRegistro DESC;
END
GO

IF OBJECT_ID('dbo.sp_GetExpedienteById', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetExpedienteById;
GO

CREATE PROCEDURE dbo.sp_GetExpedienteById
    @ExpedienteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Descripcion,
        e.Ubicacion,
        e.Estado,
        e.TecnicoId,
        t.FullName AS TecnicoNombre,
        e.CoordinadorId,
        c.FullName AS CoordinadorNombre,
        e.Justificacion,
        e.FechaRegistro,
        e.FechaRevision,
        e.FechaAprobacion,
        (SELECT COUNT(*) FROM dbo.Indicios WHERE ExpedienteId = e.ExpedienteId) AS TotalIndicios
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users t ON e.TecnicoId = t.UserId
    LEFT JOIN dbo.Users c ON e.CoordinadorId = c.UserId
    WHERE e.ExpedienteId = @ExpedienteId;
END
GO

IF OBJECT_ID('dbo.sp_UpdateExpediente', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_UpdateExpediente;
GO

CREATE PROCEDURE dbo.sp_UpdateExpediente
    @ExpedienteId INT,
    @NumeroExpediente VARCHAR(50),
    @Descripcion VARCHAR(500),
    @Ubicacion VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Expedientes
    SET 
        NumeroExpediente = @NumeroExpediente,
        Descripcion = @Descripcion,
        Ubicacion = @Ubicacion
    WHERE ExpedienteId = @ExpedienteId
        AND Estado = 'Borrador';
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Descripcion,
        e.Ubicacion,
        e.Estado,
        e.TecnicoId,
        t.FullName AS TecnicoNombre,
        e.FechaRegistro
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users t ON e.TecnicoId = t.UserId
    WHERE e.ExpedienteId = @ExpedienteId;
END
GO

IF OBJECT_ID('dbo.sp_SubmitForReview', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_SubmitForReview;
GO

CREATE PROCEDURE dbo.sp_SubmitForReview
    @ExpedienteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Expedientes
    SET 
        Estado = 'En Revisión',
        FechaRevision = GETDATE()
    WHERE ExpedienteId = @ExpedienteId
        AND Estado = 'Borrador';
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Estado,
        e.FechaRevision,
        t.FullName AS TecnicoNombre
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users t ON e.TecnicoId = t.UserId
    WHERE e.ExpedienteId = @ExpedienteId;
END
GO
