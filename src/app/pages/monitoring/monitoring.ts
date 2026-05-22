import { Component, inject } from '@angular/core';
import { DashboardDataService } from '../../dashboard-data.service';
import { WrapperInfo, WrapperState } from '../../models';
import { wrapperStateBadgeClass } from '../../ui-tokens';

@Component({
  selector: 'app-monitoring',
  host: {
    class: 'block'
  },
  imports: [],
  templateUrl: './monitoring.html',
})
export class Monitoring {
  private readonly data = inject(DashboardDataService);

  readonly wrappers = this.data.wrappers;

  wrapperStateClass(state: WrapperState): string {
    return wrapperStateBadgeClass(state);
  }

  memoryPercent(wrapper: WrapperInfo): number {
    return Math.min(100, Math.round((wrapper.usedMemoryMb / Math.max(wrapper.maxMemoryMb, 1)) * 100));
  }

  memoryBarClass(percent: number): string {
    if (percent >= 85) {
      return 'bg-linear-to-r from-rose-300 to-orange-400';
    }
    if (percent >= 60) {
      return 'bg-linear-to-r from-amber-200 to-orange-300';
    }
    return 'bg-linear-to-r from-cyan-300 to-sky-500';
  }

  availableMemoryMb(wrapper: WrapperInfo): number {
    return Math.max(0, wrapper.maxMemoryMb - wrapper.usedMemoryMb);
  }
}
