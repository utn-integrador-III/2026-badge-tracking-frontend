# Arquitectura frontend

## Principios

1. Mobile-first: viewport mínimo de 360 px.
2. Offline-first para visualización del badge y generación de QR.
3. Separación por dominio en `features/`.
4. Componentes presentacionales en `components/` y lógica de negocio en `features/` / `lib/`.
5. Accesibilidad WCAG 2.1 AA desde el inicio.

## Dominios sugeridos

- `auth`: PIN, sesión local, guards.
- `badges`: lectura y visualización de credenciales.
- `sharing`: QR, selección de atributos, TTL y disclosure.
- `verification`: escaneo, validación offline y resultado pass/fail.
- `admin`: dashboards, emisión, revocación, CSV/LDAP.

## PWA

La plantilla trae un service worker simple en `public/sw.js`. Para producción se recomienda endurecer la estrategia de cache y versionado, especialmente para:

- Shell de la aplicación.
- Badge local cifrado.
- Llaves públicas y revocation lists.
- Manejo de expiración de tokens QR.
