import { Component, computed, input } from '@angular/core';
import { ChartSeries, SparkPoint } from '../models';

@Component({
  selector: 'app-kc-sparkline',
  host: {
    class: 'block min-h-full'
  },
  templateUrl: './sparkline.html',
})
export class Sparkline {
  readonly series  = input.required<ChartSeries>();
  /** Unique SVG id suffix to isolate gradient + filter per instance */
  readonly uid     = input.required<string>();

  readonly gradId  = computed(() => `sg-${this.uid()}`);
  readonly filtId  = computed(() => `sf-${this.uid()}`);

  polyline(points: SparkPoint[]): string {
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  }

  polylineFill(points: SparkPoint[], h: number): string {
    if (!points.length) return '';
    const start = `${points[0].x},${h}`;
    const end   = `${points[points.length - 1].x},${h}`;
    return `${start} ${this.polyline(points)} ${end}`;
  }

  /** Most-recent value (last point, inverted because y=0 is top) */
  readonly currentValue = computed(() => {
    const pts = this.series().points;
    if (!pts.length) return 0;
    return Math.round(100 - pts[pts.length - 1].y);
  });
}
