# F1 2026 Live Board

Dashboard moderno hecho con React + Vite + TypeScript para visualizar la temporada 2026 de Formula 1 y Formula 2.

## Que muestra

- Calendario de proximas carreras separado por F1 y F2.
- Horarios normalizados para Argentina (`America/Argentina/Buenos_Aires`).
- Carreras F1 ya disputadas con ganador y detalle completo de todos los pilotos.
- Tabla de clasificacion de pilotos por puntos.
- Grilla de pilotos con foto, escuderia, logo/fallback y puntos.
- Datos centralizados en `f1_data.json` como fuente de verdad.

## Arquitectura

```txt
src/
  components/  # Componentes de UI chicos y reutilizables
  data/        # Adaptador hacia f1_data.json
  domain/      # Tipos y selectores puros del dominio
  utils/       # Formato de fechas, zonas horarias y helpers visuales
```

La idea es simple: el JSON no se lee directo desde los componentes. Primero pasa por `src/data`, se modela con tipos en `src/domain`, y la UI consume selectores puros. Eso mantiene el proyecto ordenado y testeable, sin mezclar reglas de negocio con JSX.

## Como correrlo localmente

```bash
npm install
npm run dev
```

Validacion de tipos:

```bash
npm run typecheck
```

> Nota: por regla del usuario no se corrio build (`npm run build` / `vite build`). El script existe para cuando vos decidas ejecutarlo.

## Fuentes utilizadas

- Calendario F1 2026: https://www.formula1.com/en/racing/2026
- Resultados F1 2026: https://www.formula1.com/en/results/2026/races
- Standings F1 2026: https://www.formula1.com/en/results/2026/drivers
- Equipos/pilotos F1 2026: https://www.formula1.com/en/teams
- Calendario F2 revisado 2026: https://www.fia.com/news/miami-and-montreal-host-fia-formula-2-championship-rounds-2026

## Decision sobre assets

Las fotos de pilotos usan URLs configuradas en `f1_data.json` cuando existen. Para logos, se usan assets directos configurables; si una escuderia no tiene URL estable verificada, la UI muestra un fallback visual para no romper la experiencia.
