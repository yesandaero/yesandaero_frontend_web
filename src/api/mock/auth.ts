import { delay } from './data';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types';

export function login(_body: LoginRequest): Promise<LoginResponse> {
  return delay({ accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', role: 'OWNER' });
}

export function signup(_body: SignupRequest): Promise<SignupResponse> {
  return delay({ userId: 1 });
}

export function logout(): Promise<void> {
  return delay(undefined);
}
