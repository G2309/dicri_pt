USE DICRI_DB;
GO

IF OBJECT_ID('dbo.sp_GetPendingExpedientes', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetPendingExpedientes;
GO

CREATE PROCEDURE dbo.sp_GetPendingExpedientes
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
        e.FechaRegistro,
        e.FechaRevision,
        (SELECT COUNT(*) FROM dbo.Indicios WHERE ExpedienteId = e.ExpedienteId) AS TotalIndicios
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users t ON e.TecnicoId = t.UserId
    WHERE e.Estado = 'En Revisión'
    ORDER BY e.FechaRevision ASC;
END
GO

IF OBJECT_ID('dbo.sp_ApproveExpediente', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_ApproveExpediente;
GO

CREATE PROCEDURE dbo.sp_ApproveExpediente
    @ExpedienteId INT,
    @CoordinadorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Expedientes
    SET 
        Estado = 'Aprobado',
        CoordinadorId = @CoordinadorId,
        FechaAprobacion = GETDATE()
    WHERE ExpedienteId = @ExpedienteId
        AND Estado = 'En Revisión';
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Estado,
        e.CoordinadorId,
        c.FullName AS CoordinadorNombre,
        e.FechaAprobacion
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users c ON e.CoordinadorId = c.UserId
    WHERE e.ExpedienteId = @ExpedienteId;
END
GO

IF OBJECT_ID('dbo.sp_RejectExpediente', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_RejectExpediente;
GO

CREATE PROCEDURE dbo.sp_RejectExpediente
    @ExpedienteId INT,
    @CoordinadorId INT,
    @Justificacion VARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Expedientes
    SET 
        Estado = 'Rechazado',
        CoordinadorId = @CoordinadorId,
        Justificacion = @Justificacion,
        FechaAprobacion = GETDATE()
    WHERE ExpedienteId = @ExpedienteId
        AND Estado = 'En Revisión';
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Estado,
        e.CoordinadorId,
        c.FullName AS CoordinadorNombre,
        e.Justificacion,
        e.FechaAprobacion
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users c ON e.CoordinadorId = c.UserId
    WHERE e.ExpedienteId = @ExpedienteId;
END
GO
