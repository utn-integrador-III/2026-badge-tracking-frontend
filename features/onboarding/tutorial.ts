export type TutorialStep = {
  body: string;
  title: string;
};

export const firstRunTutorialSteps: TutorialStep[] = [
  {
    title: 'Revise su carnet',
    body: 'Consulte nombre, rol, ID institucional, vigencia y firma digital.'
  },
  {
    title: 'Comparta su QR',
    body: 'Genere un codigo temporal para comprobar su identidad de forma segura.'
  },
  {
    title: 'Proteja su acceso',
    body: 'Use su PIN personal para mantener la credencial protegida en este dispositivo.'
  }
];

export function getNextTutorialStep(currentIndex: number, totalSteps = firstRunTutorialSteps.length) {
  return Math.min(currentIndex + 1, totalSteps - 1);
}

export function isTutorialComplete(currentIndex: number, totalSteps = firstRunTutorialSteps.length) {
  return currentIndex >= totalSteps - 1;
}
