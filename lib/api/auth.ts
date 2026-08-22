import { apiEndpoints } from '@/lib/api/endpoints';
import { apiPost } from '@/lib/api/http-client';

export const authApi = {
  setPin: (institutionalId: string, pin: string, pinConfirm: string) =>
    apiPost<{ message: string; institutionalId: string; pinSetAt: string }>(apiEndpoints.users.pin(institutionalId), { pin, pinConfirm }),
  validatePin: (institutionalId: string, pin: string) =>
    apiPost<{ valid: boolean; institutionalId: string; message: string }>(apiEndpoints.users.validatePin(institutionalId), { pin })
};
