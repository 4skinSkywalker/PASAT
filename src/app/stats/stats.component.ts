import { Component, OnInit, Inject } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stats;

  constructor(
    private statsService: StatsService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    const raw = this.statsService.getStats();
    this.stats = [
      {
        label: 'Avarage N',
        value: raw['n-games'].length ?
          (raw['n-games'].reduce((a, b) => a + b)
          / raw['n-games'].length).toFixed(1)
          : 0
      },
      {
        label: 'Highest N',
        value: raw['n-games'].length ?
          raw['n-games'].sort((a, b) => a - b).pop()
          : 0
      },
      {
        label: 'Lowest N',
        value: raw['n-games'].length ?
          raw['n-games'].sort((a, b) => b - a).pop()
          : 0
      },
      {
        label: 'Time played',
        value: raw['time-played'] / 1000 / 60 / 60 | 0,
        suffix: 'h'
      },
      {
        label: 'Total stimuli',
        value: raw.right + raw.wrong
      },
      {
        label: 'Correct inputs',
        value:
          `${(100 * raw.right
          / (raw.right + raw.wrong || 1))
          .toFixed(1)}`,
        suffix: '%'
      },
      {
        label: 'Wrong inputs',
        value:
          `${(100 * raw.wrong
          / (raw.right + raw.wrong || 1))
          .toFixed(1)}`,
        suffix: '%'
      }
    ];
  }
}
