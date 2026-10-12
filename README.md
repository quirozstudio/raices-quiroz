# Raíces Quiroz

Raíces es un espacio privado para conservar historias de vida, recuerdos personales y legados familiares.

La experiencia combina escritura libre, preguntas narrativas, grabaciones de voz, recuerdos multimedia, capítulos y permisos por historia. La privacidad es la configuración inicial de todo el producto.

## Stack

- React 19 + TypeScript.
- Vinext sobre Vite para la aplicación y el despliegue en Cloudflare.
- Supabase Auth para enlaces mágicos y sesiones.
- Supabase Database con Row Level Security.
- Supabase Storage para fotografías, audios, vídeos y documentos privados.
- Drizzle/D1 y R2 permanecen como superficie heredada del starter y no son la fuente principal del espacio privado.

## Estructura principal

- `app/page.tsx`: landing pública y SEO básico.
- `app/mi-espacio/WorkspaceClient.tsx`: espacio personal, historias, recuerdos y personas.
- `app/mi-espacio/LifeJourney.tsx`: recorrido biográfico guiado.
- `app/mi-espacio/ChapterBuilder.tsx`: constructor de capítulos y versiones.
- `app/mi-espacio/StorySharing.tsx`: permisos de lectura por historia.
- `app/mi-espacio/narrative/questions.ts`: biblioteca narrativa extensible.
- `utils/supabase/database.types.ts`: tipos generados y alineados con Supabase.
- `db/` y `drizzle/`: esquema legado de la superficie Cloudflare.

## Datos de Supabase

El proyecto conectado contiene estas tablas principales:

- `stories`: historias personales.
- `story_chapters`: capítulos ordenables.
- `story_versions`: historial de versiones de capítulos.
- `memories`: archivos privados vinculados a historias.
- `people`: personas de confianza.
- `story_access`: personas autorizadas por historia.
- `life_journeys`: progreso y respuestas del recorrido biográfico.

Todas las tablas de usuario tienen RLS activo. El bucket `memories` es privado y limita los archivos a 25 MB.

## Configuración local

Requisitos:

- Node.js `>=22.13.0`.
- Variables públicas de Supabase en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_publicable
```

Nunca añadas claves `service_role` o `sb_secret_...` al frontend ni a variables `NEXT_PUBLIC_`.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
npm test
```

`npm test` compila la aplicación y verifica el render público, la base narrativa, el constructor de capítulos y los recursos visuales.

## Principios de producto

- Nada se comparte por defecto.
- El usuario conserva la última palabra sobre cualquier transformación narrativa.
- La aplicación no inventa recuerdos, personas ni sentimientos.
- Las preguntas se pueden saltar y el progreso se guarda automáticamente.
- Las funciones de IA externas deberán incorporar consentimiento explícito, control de costes y una política clara de tratamiento de datos.
