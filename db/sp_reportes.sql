USE DICRI_DB;
GO

IF OBJECT_ID('dbo.sp_GetRegistrosReport', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetRegistrosReport;
GO

CREATE PROCEDURE dbo.sp_GetRegistrosReport
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL,
    @Estado VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.ExpedienteId,
        e.NumeroExpediente,
        e.Descripcion,
        e.Estado,
        t.FullName AS TecnicoNombre,
        c.FullName AS CoordinadorNombre,
        e.FechaRegistro,
        e.FechaRevision,
        e.FechaAprobacion,
        e.Justificacion,
        (SELECT COUNT(*) FROM dbo.Indicios WHERE ExpedienteId = e.ExpedienteId) AS TotalIndicios
    FROM dbo.Expedientes e
    INNER JOIN dbo.Users t ON e.TecnicoId = t.UserId
    LEFT JOIN dbo.Users c ON e.CoordinadorId = c.UserId
    WHERE (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
        AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)
        AND (@Estado IS NULL OR e.Estado = @Estado)
    ORDER BY e.FechaRegistro DESC;
END
GO

IF OBJECT_ID('dbo.sp_GetEstadisticas', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetEstadisticas;
GO

CREATE PROCEDURE dbo.sp_GetEstadisticas
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) AS TotalExpedientes,
        SUM(CASE WHEN Estado = 'Borrador' THEN 1 ELSE 0 END) AS TotalBorradores,
        SUM(CASE WHEN Estado = 'En Revisión' THEN 1 ELSE 0 END) AS TotalEnRevision,
        SUM(CASE WHEN Estado = 'Aprobado' THEN 1 ELSE 0 END) AS TotalAprobados,
        SUM(CASE WHEN Estado = 'Rechazado' THEN 1 ELSE 0 END) AS TotalRechazados,
        (SELECT COUNT(*) FROM dbo.Indicios i 
         INNER JOIN dbo.Expedientes e ON i.ExpedienteId = e.ExpedienteId
         WHERE (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
           AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)) AS TotalIndicios
    FROM dbo.Expedientes
    WHERE (@FechaInicio IS NULL OR FechaRegistro >= @FechaInicio)
        AND (@FechaFin IS NULL OR FechaRegistro <= @FechaFin);
END
GO
