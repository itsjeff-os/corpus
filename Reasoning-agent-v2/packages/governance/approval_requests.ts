import type { PermissionState } from './permission_state';

export interface ApprovalRequest {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  requestedAction: string;
  reason: string;
  permissionState: PermissionState;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  resolvedAt?: string;
}
