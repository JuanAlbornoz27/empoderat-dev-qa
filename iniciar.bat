@echo off
title Script de Inicio de Empoderat
cls
echo =======================================================
echo    Iniciando componentes del sistema Empoderat
echo =======================================================
echo.

REM Establecer la ruta base del proyecto (ruta absoluta)
set BASE_DIR=%~dp0

REM Crear scripts temporales para cada componente
echo @echo off > "%BASE_DIR%temp_keycloak.bat"
echo cd "%BASE_DIR%backend" >> "%BASE_DIR%temp_keycloak.bat"
echo wsl docker-compose up >> "%BASE_DIR%temp_keycloak.bat"

echo @echo off > "%BASE_DIR%temp_backend.bat"
echo cd "%BASE_DIR%backend\empoderat" >> "%BASE_DIR%temp_backend.bat"
echo mvn spring-boot:run >> "%BASE_DIR%temp_backend.bat"

echo @echo off > "%BASE_DIR%temp_frontend.bat"
echo cd "%BASE_DIR%frontend" >> "%BASE_DIR%temp_frontend.bat"
echo npm run dev >> "%BASE_DIR%temp_frontend.bat"

REM Informar al usuario
echo Para iniciar Empoderat, ejecuta estos comandos en terminales separadas de VS Code:
echo.
echo 1. Abre una terminal en VS Code (Ctrl+`)
echo 2. Ejecuta: %BASE_DIR%temp_keycloak.bat
echo 3. Espera 15 segundos para que Keycloak se inicialice
echo 4. Abre una nueva terminal (Ctrl+Shift+`) y ejecuta: %BASE_DIR%temp_backend.bat 
echo 5. Espera 10 segundos para que el backend se inicialice
echo 6. Abre una nueva terminal y ejecuta: %BASE_DIR%temp_frontend.bat
echo.
echo Información de acceso:
echo Keycloak: http://localhost:8180 (admin/admin)
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Para detener los servicios, usa Ctrl+C en cada terminal
echo =======================================================

REM Opcionalmente, iniciar el primer terminal automáticamente
start "" "%BASE_DIR%temp_keycloak.bat"
start "" "%BASE_DIR%temp_backend.bat"
start "" "%BASE_DIR%temp_frontend.bat"
REM Limpiar scripts temporales al salir
del "%BASE_DIR%temp_keycloak.bat"
del "%BASE_DIR%temp_backend.bat"
del "%BASE_DIR%temp_frontend.bat"
pause
exit
