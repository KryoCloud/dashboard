import { Component } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  host: {
    class: 'block'
  },
  imports: [],
  templateUrl: './monitoring.html',
})
export class Monitoring {
  readonly alerts = [
    { level: 'Warning', message: 'gateway-eu latency crossed 180ms', at: '08:44' },
    { level: 'Critical', message: 'cache-us-01 replication lag', at: '08:39' },
    { level: 'Info', message: 'autoscale added 2 worker nodes', at: '08:31' },
  ];

  readonly probes = [
    { name: 'API Success Rate', value: '99.92%', trend: '+0.12%' },
    { name: 'P95 Latency', value: '142ms', trend: '-18ms' },
    { name: 'Queue Delay', value: '1.8s', trend: '-0.4s' },
    { name: 'CPU Saturation', value: '61%', trend: '+3%' },
  ];

  alertLevelClass(level: string): string {
    switch (level) {
      case 'Critical':
        return 'border-rose-400/25 bg-rose-400/10 text-rose-100';
      case 'Warning':
        return 'border-amber-300/25 bg-amber-300/10 text-amber-100';
      default:
        return 'border-cyan-400/25 bg-cyan-400/10 text-cyan-100';
    }
  }

  trendClass(name: string, trend: string): string {
    const rising = trend.trim().startsWith('+');
    const lowerIsBetter = name.includes('Latency') || name.includes('Delay') || name.includes('Saturation');
    const healthy = lowerIsBetter ? !rising : rising;
    return healthy ? 'text-emerald-200' : 'text-rose-200';
  }

  trendBgClass(name: string, trend: string): string {
    const rising = trend.trim().startsWith('+');
    const lowerIsBetter = name.includes('Latency') || name.includes('Delay') || name.includes('Saturation');
    const healthy = lowerIsBetter ? !rising : rising;
    return healthy ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-rose-400/20 bg-rose-400/10';
  }
}
