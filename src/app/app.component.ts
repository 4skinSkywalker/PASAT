import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';
import { EndgameComponent } from './endgame/endgame.component';

import { GameService } from './game.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  feedback = '';

  constructor(
    private settingsDialog: MatDialog,
    private statsDialog: MatDialog,
    private endgameDialog: MatDialog,
    private settingsService: SettingsService,
    private game: GameService
  ) { }

  ngOnInit() {
    this.game.feedback
      .subscribe(this.feedbackHandler.bind(this));
    this.game.endgame
      .subscribe(this.endgameHandler.bind(this));
  }

  endgameHandler(result) {
    const { total, score } = result;
    this.openEndgame(total, score);
  }

  feedbackHandler(isCorrect) {
    this.feedback = isCorrect ? 'green' : 'red';
    setTimeout(() => this.feedback = '', 400);
  }

  keyboardHandler(e) {
    if (/^Numpad\d$/.test(e.code)) {
      this.insertChar(e.code.split('').pop());
    } else if (/^\d$/.test(e.key)) {
      this.insertChar(e.key);
    } else if (e.code in { Backspace: 1, Delete: 1 }) {
      this.removeChar();
    }
  }

  insertChar(char) {
    const input = this.game.getInput();
    if (input.length < 2) {
      this.game.setInput(input + char);
    }
    this.game.quickAnswer();
  }

  removeChar() {
    this.game.setInput('');
  }

  numpadHandler(e) {
    if (e.data === 'play') {
      this.game.play();
    } else if (e.data === 'stop') {
      this.game.stop();
    } else if (e.data === 'del') {
      this.removeChar();
    } else {
      this.insertChar(e.data);
    }
  }

  openSettings() {
    this.game.stop();
    this.settingsDialog
      .open(SettingsComponent, {
        width: '320px',
        height: '320px',
        data: {
          sliders: this.settingsService.slidersArray()
        }
      })
      .afterClosed()
      .subscribe(() =>
        this.game.configs = this.settingsService.getConfigs()
      );
  }

  openStats() {
    this.game.stop();
    this.statsDialog
      .open(StatsComponent, {
        width: '320px',
        height: '480px'
      });
  }

  openEndgame(total, score) {
    this.endgameDialog
      .open(EndgameComponent, {
        width: '320px',
        height: '240px',
        data: { total, score, wrong: total - score }
      });
  }
}
