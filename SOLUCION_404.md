# Solución para Errores 404 en Archivos Estáticos

## Problema
Los errores 404 en archivos estáticos de Next.js (`/_next/static/...`) generalmente ocurren cuando:
- El caché de Next.js está corrupto
- El servidor de desarrollo necesita reiniciarse
- Hay archivos bloqueados en la carpeta `.next`

## Solución Rápida

### Opción 1: Limpiar y Reiniciar (Recomendado)

1. **Detén el servidor** presionando `Ctrl + C` en la terminal

2. **Elimina la carpeta `.next` manualmente:**
   - En Windows: Elimina la carpeta `.next` desde el explorador de archivos
   - O ejecuta en PowerShell:
     ```powershell
     Remove-Item -Recurse -Force .next
     ```

3. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

### Opción 2: Usar el Script de Limpieza

En Windows, ejecuta:
```bash
npm run clean:win
```

Luego reinicia:
```bash
npm run dev
```

### Opción 3: Reinicio Completo

1. Cierra todas las terminales
2. Cierra el editor de código (si está abierto)
3. Elimina la carpeta `.next` manualmente
4. Abre una nueva terminal
5. Ejecuta `npm run dev`

## Verificación

Después de reiniciar, verifica que:
- No aparezcan errores 404 en la consola
- La página carga correctamente
- Los estilos se aplican bien

## Si el Problema Persiste

1. **Verifica que no haya errores de compilación:**
   - Revisa la terminal donde corre `npm run dev`
   - Busca errores en rojo

2. **Verifica la versión de Node.js:**
   ```bash
   node --version
   ```
   Debe ser Node.js 18 o superior

3. **Reinstala dependencias:**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Verifica el puerto:**
   - Asegúrate de que el puerto 3000 no esté siendo usado por otro proceso

## Nota

Los errores 404 en archivos estáticos durante el desarrollo son normales ocasionalmente, especialmente después de:
- Cambios grandes en el código
- Actualizaciones de dependencias
- Cambios en la estructura de carpetas

La solución más común es simplemente reiniciar el servidor de desarrollo.


