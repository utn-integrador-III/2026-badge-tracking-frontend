export async function verifyCredentialSignature() {
  // TODO: importar llaves públicas cacheadas y validar JWS/COSE/WebCrypto.
  // Requerimiento base: EC P-256 o RSA-2048 según documentación del proyecto.
  return { valid: false, reason: 'Not implemented' as const };
}
