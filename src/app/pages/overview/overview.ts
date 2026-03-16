import { Component, computed, inject } from '@angular/core';
import { ActivityLog } from '../../activity-log/activity-log';
import { DashboardDataService } from '../../dashboard-data.service';
import { DonutChart } from '../../donut-chart/donut-chart';
import { Sparkline } from '../../sparkline/sparkline';
import { StatCardComponent } from '../../stat-card/stat-card';
import { ChartSeries, DonutSlice, StatCard } from '../../models';

@Component({
  selector: 'app-overview',
  host: {
    class: 'block'
  },
  imports: [StatCardComponent, DonutChart, Sparkline, ActivityLog],
  templateUrl: './overview.html',
})
export class Overview {
  private readonly data = inject(DashboardDataService);

  readonly stats = computed<StatCard[]>(() => [
    {
      label: 'Active Services',
      value: `${this.data.services().length}`,
      sub: 'Local runtime registry',
      icon: 'players',
      fill: Math.min(100, this.data.services().length * 12),
    },
    {
      label: 'Group Pools',
      value: `${this.data.groups().length}`,
      sub: 'Persisted control groups',
      icon: 'peak',
    },
    {
      label: 'Launch Templates',
      value: `${this.data.templates().length}`,
      sub: 'Stored blueprint revisions',
      icon: 'servers',
    },
    {
      label: 'Accounts',
      value: `${this.data.accounts().length}`,
      sub: 'Saved operators locally',
      icon: 'memory',
    },
  ]);

  readonly donutTotal = 1284;
  readonly donutCircumference = 251.3;
  readonly donutSlices: DonutSlice[] = [
    { label: 'EU Central', players: 544, color: '#ff8a3d', offset: 0 },
    { label: 'US East', players: 372, color: '#ffd166', offset: 106 },
    { label: 'AP South', players: 248, color: '#f77f4e', offset: 179 },
    { label: 'Edge', players: 120, color: 'rgba(255,138,61,0.24)', offset: 228 },
  ];
  readonly trendLabel = 'Latency down 8.4% after balancing rewrite';

  readonly playerChart: ChartSeries = {
    title: 'Session Curve',
    subtitle: 'Concurrent users in the last 7 hours',
    color: '#ff8a3d',
    points: [
      { x: 0, y: 88 },
      { x: 50, y: 72 },
      { x: 110, y: 58 },
      { x: 160, y: 30 },
      { x: 210, y: 24 },
      { x: 270, y: 35 },
      { x: 320, y: 16 },
    ],
    labels: ['09:00', '12:00', '16:00'],
  };

  readonly memoryChart: ChartSeries = {
    title: 'Heap Trend',
    subtitle: 'Memory pressure index',
    color: '#ffd166',
    points: [
      { x: 0, y: 75 },
      { x: 55, y: 66 },
      { x: 110, y: 63 },
      { x: 170, y: 40 },
      { x: 220, y: 38 },
      { x: 275, y: 30 },
      { x: 320, y: 22 },
    ],
    labels: ['09:00', '12:00', '16:00'],
  };

  readonly activityLog = this.data.activityEntries;
}
