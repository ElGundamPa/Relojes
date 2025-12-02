@echo off
echo Limpiando procesos de Node.js en puertos 3000-3005...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul
echo Puertos limpiados. Ahora puedes ejecutar: npm run dev


