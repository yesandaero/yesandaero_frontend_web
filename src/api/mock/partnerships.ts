import { delay, mockDb } from './data';
import { apiErrorFromCode } from '../client';
import type {
  AcceptPartnershipResponse,
  PartnershipListResponse,
  PartnershipStatus,
  RejectPartnershipResponse,
  RequestPartnershipRequest,
  RequestPartnershipResponse,
} from '../types';

export function listPartnerships(status?: PartnershipStatus): Promise<PartnershipListResponse> {
  const list = status ? mockDb.partnerships.filter((p) => p.status === status) : mockDb.partnerships;
  return delay({ partnerships: list });
}

export function requestPartnership(body: RequestPartnershipRequest): Promise<RequestPartnershipResponse> {
  const partnershipId = mockDb.nextPartnershipId++;
  mockDb.partnerships.push({
    partnershipId,
    partnerStore: { storeId: body.receiverStoreId, name: `가게 #${body.receiverStoreId}`, category: 'KOREAN' },
    direction: 'SENT',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  });
  return delay({ partnershipId, status: 'PENDING' });
}

function findOrThrow(partnershipId: number) {
  const p = mockDb.partnerships.find((x) => x.partnershipId === partnershipId);
  if (!p) throw apiErrorFromCode('PTN_404');
  return p;
}

export async function acceptPartnership(partnershipId: number): Promise<AcceptPartnershipResponse> {
  const p = findOrThrow(partnershipId);
  // 명세서: PENDING 상태에서만 수락 가능 (아니면 409)
  if (p.status !== 'PENDING') throw apiErrorFromCode('PTN_409_02');
  p.status = 'ACCEPTED';
  return delay({ partnershipId, status: p.status, acceptedAt: new Date().toISOString() });
}

export async function rejectPartnership(partnershipId: number): Promise<RejectPartnershipResponse> {
  const p = findOrThrow(partnershipId);
  // 명세서: PENDING 상태에서만 거절 가능 (아니면 409)
  if (p.status !== 'PENDING') throw apiErrorFromCode('PTN_409_02');
  p.status = 'REJECTED';
  return delay({ partnershipId, status: p.status });
}

export async function terminatePartnership(partnershipId: number): Promise<void> {
  const p = findOrThrow(partnershipId);
  // 명세서: ACCEPTED 상태에서만 해지 가능 (아니면 409)
  if (p.status !== 'ACCEPTED') throw apiErrorFromCode('PTN_409_02');
  p.status = 'TERMINATED';
  return delay(undefined);
}
