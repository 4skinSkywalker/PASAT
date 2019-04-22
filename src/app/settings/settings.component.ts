import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  sliders;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.sliders = this.data.sliders;
  }

  save() {
    const configs = {};
    this.sliders.map(slider => configs[slider.id] = slider.value);
    this.settingsService.save(configs);
  }
}
