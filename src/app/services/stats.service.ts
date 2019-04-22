import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  entryName = 'pasat-stats';

  statsObject = {
    'n-games': [],
    'time-played': 0,
    right: 0,
    wrong: 0
  };

  initStats() {
    this.save(this.statsObject);
    return this.statsObject;
  }

  getStats() {
    const saved = JSON.parse(localStorage.getItem(this.entryName));
    if (!saved) {
      return this.initStats();
    }
    return saved;
  }

  save(stats) {
    localStorage.setItem(
      this.entryName,
      JSON.stringify(stats)
    );
  }
}
