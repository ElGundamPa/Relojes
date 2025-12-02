#!/bin/bash
echo "Limpiando procesos de Node.js..."
pkill -f node || true
sleep 2
echo "Puertos limpiados. Ahora puedes ejecutar: npm run dev"


