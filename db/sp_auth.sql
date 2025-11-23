USE DICRI_DB;
GO

IF OBJECT_ID('dbo.sp_AuthenticateUser', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_AuthenticateUser;
GO

CREATE PROCEDURE dbo.sp_AuthenticateUser
    @Username VARCHAR(50),
    @Password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        UserId,
        Username,
        FullName,
        Role
    FROM dbo.Users
    WHERE Username = @Username 
        AND Password = @Password 
        AND IsActive = 1;
END
GO

IF OBJECT_ID('dbo.sp_GetUserById', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetUserById;
GO

CREATE PROCEDURE dbo.sp_GetUserById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        UserId,
        Username,
        FullName,
        Role,
        CreatedAt,
        UpdatedAt
    FROM dbo.Users
    WHERE UserId = @UserId AND IsActive = 1;
END
GO
