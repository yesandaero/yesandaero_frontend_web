import { apiFetch } from './client';
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
  return apiFetch<PartnershipListResponse>('/partnerships', { query: { status } });
}

export function requestPartnership(body: RequestPartnershipRequest): Promise<RequestPartnershipResponse> {
  return apiFetch<RequestPartnershipResponse>('/partnerships', { method: 'POST', body });
}

export function acceptPartnership(partnershipId: number): Promise<AcceptPartnershipResponse> {
  return apiFetch<AcceptPartnershipResponse>(`/partnerships/${partnershipId}/accept`, { method: 'PATCH' });
}

export function rejectPartnership(partnershipId: number): Promise<RejectPartnershipResponse> {
  return apiFetch<RejectPartnershipResponse>(`/partnerships/${partnershipId}/reject`, { method: 'PATCH' });
}

export function terminatePartnership(partnershipId: number): Promise<void> {
  return apiFetch<void>(`/partnerships/${partnershipId}`, { method: 'DELETE' });
}
