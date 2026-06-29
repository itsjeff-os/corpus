import type { PermissionState } from './permission_state';

export function canExecuteAction(permissionState: PermissionState): boolean {
  return permissionState === 'approved_for_scope';
}
