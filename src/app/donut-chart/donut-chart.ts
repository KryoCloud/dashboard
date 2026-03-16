import { Component, computed, input } from '@angular/core';
import { DonutSlice } from '../models';

@Component({
  selector: 'app-kc-donut-chart',
  host: {
    class: 'block min-h-full'
  },
  templateUrl: './donut-chart.html',
})
export class DonutChart {
  readonly slices       = input.required<DonutSlice[]>();
  readonly total        = input.required<number>();
  readonly trendLabel   = input('');
  readonly circumference = input(251.3);

  readonly totalPlayers = computed(() =>
    this.slices().reduce((s, sl) => s + sl.players, 0)
  );

  sliceDash(players: number): number {
    return Math.round((players / this.total()) * this.circumference());
  }
}
