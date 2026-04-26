#!/bin/bash
echo "Iniciando auditoria de qualidade S01..."
npx tsx server/scripts/verify-data.ts
