# Digital Badge PWA — Next.js Template

Plantilla inicial para una aplicación PWA mobile-first de credenciales digitales institucionales.

## Stack incluido

- Next.js + React + TypeScript
- Tailwind CSS
- PWA: manifest, service worker básico, íconos y registro en producción
- QR: `qrcode.react` para generar códigos y `html5-qrcode` para escaneo
- Estado/datos: Zustand y TanStack Query
- Formularios/validación: React Hook Form, Zod y resolvers
- i18n base: `next-intl` y estructura de mensajes ES/EN
- Testing: Vitest, Testing Library y Playwright

## Instalación

```bash
pnpm install
pnpm dev
```

Con npm:

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta:

```bash
cp .env.example .env.local
```

## Estructura

```txt
app/                    Rutas App Router: home, badge, share, verify, admin
components/             UI reutilizable: badge, layout, PWA, QR
features/               Módulos por dominio: auth, badges, sharing, verification
lib/                    API client, crypto, offline cache, i18n, validación
public/                 Manifest, service worker e íconos PWA
types/                  Tipos compartidos
tests/                  Unit/e2e
docs/                   Documentación técnica del frontend
```

## Pendientes de implementación

- Reemplazar mocks por endpoints reales del backend.
- Implementar validación criptográfica con Web Crypto/JWS/COSE.
- Definir estrategia final para cache de llaves públicas y revocation lists.
- Añadir control de PIN y biometría según compatibilidad web/PWA.
- Completar i18n con archivos por pantalla.
- Añadir pruebas e2e del flujo: issue → share → verify.
