import { delay, mockDb } from './data';
import { apiErrorFromCode } from '../client';
import type {
  AcceptPartnershipResponse,
  PartnershipListResponse,
  RejectPartnershipResponse,
  RequestPartnershipRequest,
  RequestPartnershipResponse,
} from '../types';

export function listPartnerships(): Promise<PartnershipListResponse> {
  return delay({ partnerships: mockDb.partnerships });
}

export function requestPartnership(body: RequestPartnershipRequest): Promise<RequestPartnershipResponse> {
  const partnershipId = mockDb.nextPartnershipId++;
  mockDb.partnerships.push({
    partnershipId,
    status: 'PENDING',
    direction: 'SENT',
    counterStore: { storeId: body.receiverStoreId, name: `가게 #${body.receiverStoreId}` },
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
  p.status = 'ACCEPTED';
  p.acceptedAt = new Date().toISOString();
  return delay({ partnershipId, status: p.status, acceptedAt: p.acceptedAt });
}

export async function rejectPartnership(partnershipId: number): Promise<RejectPartnershipResponse> {
  const p = findOrThrow(partnershipId);
  p.status = 'REJECTED';
  return delay({ partnershipId, status: p.status });
}

export async function terminatePartnership(partnershipId: number): Promise<void> {
  const p = findOrThrow(partnershipId);
  p.status = 'TERMINATED';
  return delay(undefined);
}
