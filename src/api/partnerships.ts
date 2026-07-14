import { apiFetch, USE_MOCK } from './client';
import * as mock from './mock/partnerships';
import type {
  AcceptPartnershipResponse,
  PartnershipListResponse,
  PartnershipStatus,
  RejectPartnershipResponse,
  RequestPartnershipRequest,
  RequestPartnershipResponse,
} from './types';

/** status를 주면 해당 상태만 조회한다 (명세서상 선택 파라미터). */
export function listPartnerships(status?: PartnershipStatus): Promise<PartnershipListResponse> {
  if (USE_MOCK) return mock.listPartnerships(status);
  return apiFetch<PartnershipListResponse>('/partnerships', { query: { status } });
}

export function requestPartnership(body: RequestPartnershipRequest): Promise<RequestPartnershipResponse> {
  if (USE_MOCK) return mock.requestPartnership(body);
  return apiFetch<RequestPartnershipResponse>('/partnerships', { method: 'POST', body });
}

export function acceptPartnership(partnershipId: number): Promise<AcceptPartnershipResponse> {
  if (USE_MOCK) return mock.acceptPartnership(partnershipId);
  return apiFetch<AcceptPartnershipResponse>(`/partnerships/${partnershipId}/accept`, { method: 'PATCH' });
}

export function rejectPartnership(partnershipId: number): Promise<RejectPartnershipResponse> {
  if (USE_MOCK) return mock.rejectPartnership(partnershipId);
  return apiFetch<RejectPartnershipResponse>(`/partnerships/${partnershipId}/reject`, { method: 'PATCH' });
}

export function terminatePartnership(partnershipId: number): Promise<void> {
  if (USE_MOCK) return mock.terminatePartnership(partnershipId);
  return apiFetch<void>(`/partnerships/${partnershipId}`, { method: 'DELETE' });
}
