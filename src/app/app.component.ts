import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './services/settings.service';
import { StatsComponent } from './stats/stats.component';
import { StatsService } from './services/stats.service';
import { EndgameComponent } from './endgame/endgame.component';
import { Howl } from 'howler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // GAME STATE
  game = {
    configs: {},
    stats: {},
    id: setTimeout(() => console.log('Ready'), 0),
    running: false,
    input: '',
    score: 0
  };

  // SOUNDS OBJECT
  sounds = {};

  constructor(
    private settingsService: SettingsService,
    private statsService: StatsService,
    private settingsDialog: MatDialog,
    private statsDialog: MatDialog,
    private endgameDialog: MatDialog
  ) { }

  ngOnInit() {

    // INIT SOUNDS
    [1,2,3,4,5,6,7,8,9].map(n => {
      const path = `./assets/snd/${n}.wav`;
      this.sounds[n] = new Howl({ src: path });
    });

    // INIT SETTINGS
    this.game.configs = this.settingsService.getConfigs();
    this.game.stats = this.statsService.getStats();
  }

  // START KEYBOARD & NUMPAD
  keyboardHandler(e) {
    if (/^Numpad\d$/.test(e.code)) {
      this.insertChar(e.code.split('').pop());
    } else if (/^\d$/.test(e.key)) {
      this.insertChar(e.key);
    } else if (e.code in { 'Backspace': 1, 'Delete': 1 }) {
      this.removeChar();
    }
  }

  insertChar(char) {
    if (this.game.input.length < 2) {
      this.game.input += char;
    }
  }

  removeChar() {
    this.game.input =
      this.game.input.substr(0, this.game.input.length - 1);
  }

  numpadHandler(e) {
    if (e.data === 'play') {
      this.play();
    } else if (e.data === 'stop') {
      this.stop();
    } else if (e.data === 'del') {
      this.removeChar();
    } else {
      this.insertChar(e.data);
    }
  }
  // END KEYBOARD & NUMPAD

  // START DIALOGS
  openSettings() {
    this.stop();
    this.settingsDialog
      .open(SettingsComponent, {
        width: '320px',
        height: '320px',
        data: { sliders: this.settingsService.slidersArray() }
      })
      .afterClosed()
      .subscribe(() =>
        this.game.configs = this.settingsService.getConfigs()
      );
  }

  openStats() {
    this.stop();
    this.statsDialog
      .open(StatsComponent, {
        width: '320px',
        height: '480px'
      });
  }

  openEndgame(total, right) {
    this.endgameDialog
      .open(EndgameComponent, {
        width: '320px',
        height: '240px',
        data: { total, right, wrong: total - right }
      });
  }
  // END DIALOGS

  // START PLAY, STOP & RESET
  play() {
    console.log('Play');

    this.reset();
    this.run();
    this.game.running = true;
  }

  stop() {
    console.log('Stop');

    this.reset();
    this.game.running = false;
  }

  reset() {
    clearInterval(this.game.id);
    this.game.configs = this.settingsService.getConfigs();
    this.game.input = '';
    this.game.score = 0;
  }
  // END PLAY, STOP & RESET

  // START GAME LOGICS
  run() {
    const loop = this.loopMaker(
      this.sequence(),
      this.game.configs
    );
    loop();
  }

  sequence() {
    const quantity = +this.game.configs['stim-qty'];

    const sequence = [];
    for (let i = 0; i < quantity; i++) {
      const random = 1 + Math.floor(Math.random() * 9);
      sequence.push(random);
    }

    console.log('Sequence:', sequence);
    return sequence;
  }

  loopMaker(sequence, configs) {
    const quantity = +configs['stim-qty'];
    const nBack = +configs['n-back'];
    let i = 0;
    const startTime = new Date().getTime();

    const loop = () => {
      if (i >= nBack) {
        const chunk = sequence
          .slice(i - nBack, i);
        const correctResult = chunk
          .reduce((a, b) => a + b);
        if (this.checkUserInput(correctResult)) {
          this.game.score++;
          console.log('Correct.');
        } else {
          console.log('WRONG!');
        }
        console.log('User input     :',
          this.game.input || null);
        console.log('Correct result :',
          chunk.join(' + '), '=', correctResult);
        if (i + 1 > quantity) {
          const endTime = new Date().getTime();

          this.game.stats['time-played'] +=
            endTime - startTime;
          this.game.stats['right'] += this.game.score;
          this.game.stats['wrong'] +=
            quantity - nBack - this.game.score;
          this.game.stats['n-games'].push(nBack);
          this.statsService.save(this.game.stats);

          this.openEndgame(
            quantity - nBack - 1,
            this.game.score
          );

          console.log('Score:', this.game.score);
          return this.stop();
        }
      }

      this.sounds[sequence[i]].play();

      i++;
      this.game.configs['stim-qty']--;
      this.game.input = '';

      this.game.id = setTimeout(
        loop,
        this.game.configs['stim-time']
      );
    };

    return loop;
  }

  checkUserInput(value) {
    return +this.game.input === value;
  }
  // END GAME LOGICS
}
