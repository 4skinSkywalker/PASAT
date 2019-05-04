import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { SettingsService } from './services/settings.service';
import { StatsService } from './services/stats.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  feedback = new Subject();
  endgame = new Subject();

  initialState = {
    id: setTimeout(() => console.log('Ready'), 0),
    time: 0,
    quantity: 0,
    nBack: 0,
    running: false,
    index: 0,
    startTime: 0,
    endTime: 0,
    sequence: [],
    currentChunk: [],
    input: '',
    correctResult: 0,
    score: 0
  };

  sounds = {};
  configs = {};
  statistics = {};
  state = {
    ...this.initialState
  };

  constructor(
    private settingsService: SettingsService,
    private statsService: StatsService,
  ) {
    this.loadSounds();
    this.configs = this.settingsService.getConfigs();
    this.statistics = this.statsService.getStats();
  }

  play() {
    this.reset();
    this.init();
    this.run();
    this.state.running = true;
  }

  stop() {
    this.reset();
    this.state.running = false;
  }

  getInput() {
    return this.state.input;
  }

  setInput(value) {
    this.state.input = value;
  }

  quickAnswer() {
    const { input, correctResult } = this.state;

    const isCorrect = +input === correctResult;
    if (!isCorrect || correctResult === 0) {
      return;
    }
    clearInterval(this.state.id);
    this.feedback.next(true);
    this.state.id = setTimeout(this.run.bind(this), 200);
  }

  private reset() {
    clearInterval(this.state.id);
    this.configs = this.settingsService.getConfigs();
    this.state = { ...this.initialState };
  }

  private loadSounds() {
    [1,2,3,4,5,6,7,8,9].map(n => {
      const path = `./assets/snd/${n}.wav`;
      this.sounds[n] = new Howl({ src: path });
    });
  }

  private init() {
    this.state.time = +this.configs['stim-time']
    this.state.quantity = +this.configs['stim-qty'];
    this.state.nBack = +this.configs['n-back'];
    this.state.startTime = new Date().getTime();
    this.state.sequence = this.makeSequence();
  }

  private run() {
    const { time, quantity, nBack, index, input, correctResult } = this.state;

    if (index >= nBack) {
      const isCorrect = +input === correctResult;
      if (isCorrect) {
        this.state.score++;
      }
      this.feedback.next(isCorrect);
      this.logInputAndCorrectAnswer();
    }

    if (index + 1 > quantity) {
      this.state.endTime = new Date().getTime();
      this.updateStatistics();

      this.endgame.next({
        total: quantity - (nBack - 1),
        score: this.state.score
      });

      return this.stop();
    }

    this.playSound(index);
    this.updateState(++this.state.index);

    this.state.id = setTimeout(this.run.bind(this), time);
  }

  private makeSequence() {
    const sequence = [];
    for (let i = 0; i < this.state.quantity; i++) {
      sequence.push(1 + Math.floor(Math.random() * 9));
    }
    console.log('Sequence       :', sequence);
    return sequence;
  }

  private updateStatistics() {
    const { quantity, nBack, startTime, endTime, score } = this.state;

    this.statistics['time-played'] += endTime - startTime;
    this.statistics['right'] += score;
    this.statistics['wrong'] += quantity - (nBack - 1) - score;
    this.statistics['n-games'].push(nBack);
    this.statsService.save(this.statistics);

    console.log('Score          :', score);
  }

  private playSound(i) {
    this.sounds[this.state.sequence[i]].play();
  }

  private updateState(i) {
    const { nBack, sequence } = this.state;
    this.configs['stim-qty']--; // it shouldn't be here probably
    this.state.input = '';

    if (i < nBack) {
      return;
    }
    this.state.currentChunk = sequence.slice(i - nBack, i);
    this.state.correctResult = this.state.currentChunk.reduce((a, b) => a + b);
  }

  private logInputAndCorrectAnswer() {
    const { input, currentChunk, correctResult } = this.state;

    console.log('User input     :', input || null);
    console.log('Correct result :',
      currentChunk.join(' + '), '=', correctResult);
  }
}
