import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  entryName = 'pasat-configs';

  slidersObject = {
    'stim-qty': {
      label: 'Number of stimuli',
      min: 10,
      max: 100,
      step: 10,
      value: 30
    },
    'stim-time': {
      label: 'Stimulus duration',
      min: 3000,
      max: 10000,
      step: 500,
      value: 3500
    },
    'n-back': {
      label: 'N-back',
      min: 2,
      max: 10,
      step: 1,
      value: 2
    }
  };

  slidersArray() {
    return Object.keys(this.slidersObject)
    .map(key => {
      const saved =
        JSON.parse(localStorage.getItem(this.entryName));
      if (saved) {
        this.slidersObject[key].value = +saved[key];
      }
      this.slidersObject[key].id = key;
      return this.slidersObject[key];
    });
  }

  initConfigs() {
    const configs = {};
    Object.keys(this.slidersObject)
      .map(key => configs[key] = this.slidersObject[key].value);
    this.save(configs);
    return configs;
  }

  getConfigs() {
    const saved = JSON.parse(localStorage.getItem(this.entryName));
    if (!saved) {
      return this.initConfigs();
    }
    return saved;
  }

  save(configs) {
    localStorage.setItem(
      this.entryName,
      JSON.stringify(configs)
    );
  }
}
