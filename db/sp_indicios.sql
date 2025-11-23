USE DICRI_DB;
GO

IF OBJECT_ID('dbo.sp_CreateIndicio', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_CreateIndicio;
GO

CREATE PROCEDURE dbo.sp_CreateIndicio
    @ExpedienteId INT,
    @Descripcion VARCHAR(500),
    @Color VARCHAR(50) = NULL,
    @Tamano VARCHAR(100) = NULL,
    @Peso DECIMAL(10, 2) = NULL,
    @Ubicacion VARCHAR(255),
    @TecnicoId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.Indicios (ExpedienteId, Descripcion, Color, Tamano, Peso, Ubicacion, TecnicoId)
    VALUES (@ExpedienteId, @Descripcion, @Color, @Tamano, @Peso, @Ubicacion, @TecnicoId);
    
    SELECT 
        i.IndicioId,
        i.ExpedienteId,
        i.Descripcion,
        i.Color,
        i.Tamano,
        i.Peso,
        i.Ubicacion,
        i.TecnicoId,
        t.FullName AS TecnicoNombre,
        i.FechaRegistro
    FROM dbo.Indicios i
    INNER JOIN dbo.Users t ON i.TecnicoId = t.UserId
    WHERE i.IndicioId = SCOPE_IDENTITY();
END
GO

IF OBJECT_ID('dbo.sp_GetIndiciosByExpediente', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetIndiciosByExpediente;
GO

CREATE PROCEDURE dbo.sp_GetIndiciosByExpediente
    @ExpedienteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.IndicioId,
        i.ExpedienteId,
        i.Descripcion,
        i.Color,
        i.Tamano,
        i.Peso,
        i.Ubicacion,
        i.TecnicoId,
        t.FullName AS TecnicoNombre,
        i.FechaRegistro
    FROM dbo.Indicios i
    INNER JOIN dbo.Users t ON i.TecnicoId = t.UserId
    WHERE i.ExpedienteId = @ExpedienteId
    ORDER BY i.FechaRegistro DESC;
END
GO

IF OBJECT_ID('dbo.sp_UpdateIndicio', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_UpdateIndicio;
GO

CREATE PROCEDURE dbo.sp_UpdateIndicio
    @IndicioId INT,
    @Descripcion VARCHAR(500),
    @Color VARCHAR(50) = NULL,
    @Tamano VARCHAR(100) = NULL,
    @Peso DECIMAL(10, 2) = NULL,
    @Ubicacion VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Indicios
    SET 
        Descripcion = @Descripcion,
        Color = @Color,
        Tamano = @Tamano,
        Peso = @Peso,
        Ubicacion = @Ubicacion
    WHERE IndicioId = @IndicioId;
    
    SELECT 
        i.IndicioId,
        i.ExpedienteId,
        i.Descripcion,
        i.Color,
        i.Tamano,
        i.Peso,
        i.Ubicacion,
        i.TecnicoId,
        t.FullName AS TecnicoNombre,
        i.FechaRegistro
    FROM dbo.Indicios i
    INNER JOIN dbo.Users t ON i.TecnicoId = t.UserId
    WHERE i.IndicioId = @IndicioId;
END
GO

IF OBJECT_ID('dbo.sp_DeleteIndicio', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_DeleteIndicio;
GO

CREATE PROCEDURE dbo.sp_DeleteIndicio
    @IndicioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM dbo.Indicios
    WHERE IndicioId = @IndicioId;
END
GO
