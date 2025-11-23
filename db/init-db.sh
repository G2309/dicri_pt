#!/bin/bash

echo "Esperando a que SQL Server esté listo..."

for i in {1..5}; do
    /opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -Q "SELECT 1" -C > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "SQL Server está listo"
        break
    fi
    echo "Intento $i/5..."
    sleep 1
done

echo "Ejecutando scripts de base de datos..."

/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -d DICRI_DB -i /db/seed.sql -C
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -d DICRI_DB -i /db/sp_auth.sql -C
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -d DICRI_DB -i /db/sp_expedientes.sql -C
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -d DICRI_DB -i /db/sp_indicios.sql -C
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -d DICRI_DB -i /db/sp_revision.sql -C
/opt/mssql-tools18/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -d DICRI_DB -i /db/sp_reportes.sql -C

echo "Base de datos inicializada correctamente"

