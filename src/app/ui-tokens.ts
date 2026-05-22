import { ActivityStatus, CloudServiceState, GroupServiceType, WrapperState } from './models';

export type ActionButtonVariant = 'start' | 'restart' | 'stop' | 'delete' | 'remove';

const compactBadgeBase = 'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]';
const regularBadgeBase = 'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]';
const activityBadgeBase = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]';
const actionButtonBase = 'inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition';

export function serviceTypeBadgeClass(serviceType: GroupServiceType): string {
  switch (serviceType) {
    case 'PROXY':
      return `${compactBadgeBase} border-cyan-400/25 bg-cyan-400/10 text-cyan-200`;
    case 'LOBBY':
      return `${compactBadgeBase} border-amber-300/25 bg-amber-300/10 text-amber-100`;
    default:
      return `${compactBadgeBase} border-orange-400/25 bg-orange-400/10 text-orange-200`;
  }
}

export function serviceStateBadgeClass(status: CloudServiceState): string {
  switch (status) {
    case 'RUNNING':
      return `${regularBadgeBase} border-emerald-400/25 bg-emerald-400/10 text-emerald-100`;
    case 'PREPARING':
    case 'STARTING':
      return `${regularBadgeBase} border-cyan-400/25 bg-cyan-400/10 text-cyan-100`;
    case 'STOPPING':
      return `${regularBadgeBase} border-amber-300/25 bg-amber-300/10 text-amber-100`;
    case 'STOPPED':
      return `${regularBadgeBase} border-slate-400/25 bg-slate-400/10 text-slate-200`;
    case 'FAILED':
      return `${regularBadgeBase} border-rose-400/25 bg-rose-400/10 text-rose-100`;
  }
}

export function wrapperStateBadgeClass(state: WrapperState): string {
  switch (state) {
    case 'AVAILABLE':
      return `${regularBadgeBase} border-emerald-400/25 bg-emerald-400/10 text-emerald-100`;
    case 'STARTING':
      return `${regularBadgeBase} border-cyan-400/25 bg-cyan-400/10 text-cyan-100`;
    case 'BUSY':
      return `${regularBadgeBase} border-amber-300/25 bg-amber-300/10 text-amber-100`;
    case 'DRAINING':
      return `${regularBadgeBase} border-orange-400/25 bg-orange-400/10 text-orange-100`;
    case 'OFFLINE':
      return `${regularBadgeBase} border-slate-400/25 bg-slate-400/10 text-slate-200`;
  }
}

export function activityStatusBadgeClass(status: ActivityStatus): string {
  switch (status) {
    case 'connected':
      return `${activityBadgeBase} border-cyan-400/25 bg-cyan-400/10 text-cyan-200`;
    case 'started':
      return `${activityBadgeBase} border-emerald-400/25 bg-emerald-400/10 text-emerald-200`;
    case 'stopped':
      return `${activityBadgeBase} border-rose-400/25 bg-rose-400/10 text-rose-200`;
    default:
      return `${activityBadgeBase} border-amber-300/25 bg-amber-300/10 text-amber-100`;
  }
}

export function accountAccessBadgeClass(access: string): string {
  switch (access) {
    case 'Full':
      return `${regularBadgeBase} border-rose-400/25 bg-rose-400/10 text-rose-100`;
    case 'Deploy + Logs':
      return `${regularBadgeBase} border-orange-300/25 bg-orange-300/10 text-orange-100`;
    case 'Deploy':
      return `${regularBadgeBase} border-cyan-400/25 bg-cyan-400/10 text-cyan-100`;
    default:
      return `${regularBadgeBase} border-slate-400/25 bg-slate-400/10 text-slate-200`;
  }
}

export function apiScopeBadgeClass(scope: string): string {
  if (scope.includes('write')) {
    return `${compactBadgeBase} border-orange-300/20 bg-orange-300/10 text-orange-100`;
  }

  return `${compactBadgeBase} border-cyan-400/20 bg-cyan-400/10 text-cyan-100`;
}

export function actionButtonClass(variant: ActionButtonVariant): string {
  switch (variant) {
    case 'start':
      return `${actionButtonBase} border-emerald-400/20 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/16`;
    case 'restart':
      return `${actionButtonBase} border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300/16`;
    case 'stop':
      return `${actionButtonBase} border-slate-400/20 bg-slate-400/10 text-slate-200 hover:bg-slate-400/16`;
    case 'delete':
    case 'remove':
      return `${actionButtonBase} border-rose-400/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/16`;
  }
}