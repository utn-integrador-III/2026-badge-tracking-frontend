export type InstitutionalUser = {
  nationalId: string;
  studentId: string;
  fullName: string;
  firstName: string;
  initials: string;
  role: 'Estudiante' | 'Profesor' | 'Personal';
  program: string;
  campus: string;
  email: string;
};

const users: Record<string, InstitutionalUser> = {
  '123456789': {
    nationalId: '123456789',
    studentId: '2024-0001',
    fullName: 'Juan Carlos Rodríguez Vargas',
    firstName: 'Juan',
    initials: 'JR',
    role: 'Estudiante',
    program: 'Ingeniería en Sistemas de Información',
    campus: 'Sede Central - Pedregal',
    email: 'jrodriguez@utn.ac.cr',
  },
  '987654321': {
    nationalId: '987654321',
    studentId: '2023-0187',
    fullName: 'María Fernanda Solano Rojas',
    firstName: 'María',
    initials: 'MS',
    role: 'Estudiante',
    program: 'Ingeniería del Software',
    campus: 'Sede Central - Pedregal',
    email: 'msolano@utn.ac.cr',
  },
  '456789123': {
    nationalId: '456789123',
    studentId: 'P-0042',
    fullName: 'Carlos Andrés Méndez Mora',
    firstName: 'Carlos',
    initials: 'CM',
    role: 'Profesor',
    program: 'Tecnologías de Información',
    campus: 'Sede Central - Pedregal',
    email: 'cmendez@utn.ac.cr',
  }
};

export const DEMO_VERIFICATION_CODE = '123456';

export function findInstitutionalUser(nationalId: string) {
  return users[nationalId] ?? null;
}

export function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 3))}@${domain}`;
}
