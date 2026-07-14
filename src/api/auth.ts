import { apiFetch } from './client';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './types';

export function login(body: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body, auth: false });
}

export function signup(body: SignupRequest): Promise<SignupResponse> {
  return apiFetch<SignupResponse>('/auth/signup', { method: 'POST', body, auth: false });
}

export function logout(): Promise<void> {
  return apiFetch<void>('/auth/logout', { method: 'POST' });
}
