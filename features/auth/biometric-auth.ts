export type BiometricAvailability =
  | { available: true; reason: 'Biometric unlock available' }
  | { available: false; reason: 'WebAuthn not supported' | 'Platform authenticator not available' };

type BiometricNavigator = Navigator & {
  credentials?: CredentialsContainer;
};

export async function getBiometricAvailability(navigatorRef: BiometricNavigator = navigator): Promise<BiometricAvailability> {
  if (!navigatorRef.credentials || !window.PublicKeyCredential) {
    return { available: false, reason: 'WebAuthn not supported' };
  }

  const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

  return available
    ? { available: true, reason: 'Biometric unlock available' }
    : { available: false, reason: 'Platform authenticator not available' };
}

export function getBiometricUnlockMessage(availability: BiometricAvailability) {
  return availability.available
    ? 'Desbloqueo biometrico disponible en este dispositivo.'
    : 'Use su PIN. El desbloqueo biometrico no esta disponible en este dispositivo.';
}
