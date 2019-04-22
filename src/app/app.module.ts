import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider';
import 'hammerjs';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NumpadComponent } from './numpad/numpad.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from './stats/stats.component';
import { EndgameComponent } from './endgame/endgame.component';

@NgModule({
  declarations: [AppComponent, NumpadComponent, SettingsComponent, StatsComponent, EndgameComponent],
  imports: [
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    MatListModule,
    MatDividerModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule
  ],
  entryComponents: [
    SettingsComponent,
    StatsComponent,
    EndgameComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
