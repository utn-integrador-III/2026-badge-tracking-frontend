# Digital Badge PWA

Aplicación PWA mobile-first para credenciales digitales institucionales.

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

El navegador consume `/api/backend` en el mismo origen. El servidor de Next.js reenvía esas solicitudes al backend definido en `BACKEND_API_BASE_URL`, evitando exponer esa dirección al cliente y sin requerir CORS entre ambos servicios.

```env
NEXT_PUBLIC_URL_BASE=/api/backend
BACKEND_API_BASE_URL=https://api.example.edu
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

## Consideraciones pendientes

- Implementar validación criptográfica con Web Crypto/JWS/COSE.
- Definir estrategia final para cache de llaves públicas y revocation lists.
- Añadir control de PIN y biometría según compatibilidad web/PWA.
- Completar i18n con archivos por pantalla.
- Añadir pruebas e2e del flujo: issue → share → verify.
