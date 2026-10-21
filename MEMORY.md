# MEMORY.md

## App Info
- Subdomain: chat-aespct
- Repo: template/chat
- Created: 2026-10-20T21:11:17.645Z

## Architecture
### Fase 1 (2026-10-21): Personalidad original y emociones simuladas
- Nuevo archivo: `data/luna-personality.json` — identidad, estilo, límites, siete emociones simuladas (alegria, tristeza, curiosidad, entusiasmo, tranquilidad, cariño, preocupacion) y reglas de detección por palabras clave.
- `server.js`: añadida `PERSONALITY_PATH`, `loadPersonality()` con caché de 60s, `detectMood(message)` (detección por palabras clave sin llamadas extra al modelo), y `reply()` modificado para inyectar el estado emocional y los límites de identidad en el system prompt.
- Fallback: si falla la detección o falta el archivo, usa el estado por defecto `tranquilidad`.
- Riesgos controlados: no consume créditos adicionales, no modifica datos de usuarios, no desactiva autenticación.
### Datos protegidos (no tocar)
- `data/luna-users.json` — intacto tras Fase 1 (huella verificada).
- `data/luna-legacy.json` — intacto tras Fase 1 (huella verificada).
- No se ejecutó migración heredada ni se borró ningún dato.

## Known Issues
(none yet)

## Decisions
(none yet)

## How to Use Memory
- Update this file with important decisions, architecture choices, and lessons
- Daily logs go in `memory/2026-10-20.md` (create memory/ dir if needed)
- Use /compact if context gets long during a session
