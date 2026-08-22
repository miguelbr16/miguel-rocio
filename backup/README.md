# Backup pre-rediseño espectacular

Copia de seguridad del diseño anterior (22 ago 2026).

## Restaurar archivos

```bash
cp -r backup/pre-redesign/src/* src/
```

## Restaurar desde Git

```bash
# Rama con el diseño anterior
git checkout cursor/design-backup-4a94

# O tag
git checkout backup-pre-redesign-20250822
```

## Contenido

- `pre-redesign/src/` — código fuente completo antes del rediseño
- `pre-redesign/photos/` — copia de `/public/photos`
