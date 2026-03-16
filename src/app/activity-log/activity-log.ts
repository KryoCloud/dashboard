import { Component, computed, input, signal } from '@angular/core';
import { ActivityEntry, ActivityStatus } from '../models';
import { activityStatusBadgeClass } from '../ui-tokens';

@Component({
  selector: 'app-kc-activity-log',
  host: {
    class: 'block'
  },
  templateUrl: './activity-log.html',
})
export class ActivityLog {
  readonly entries = input.required<ActivityEntry[]>();

  readonly filterQuery = signal('');

  readonly filtered = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    if (!q) return this.entries();
    return this.entries().filter(
      (e) => e.name.toLowerCase().includes(q) || e.status.includes(q),
    );
  });

  pillClass(status: ActivityStatus): string {
    return activityStatusBadgeClass(status);
  }
}
