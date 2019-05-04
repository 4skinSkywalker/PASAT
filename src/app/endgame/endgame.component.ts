import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-endgame',
  templateUrl: './endgame.component.html',
  styleUrls: ['./endgame.component.scss']
})
export class EndgameComponent implements OnInit {
  percentage = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    const { total, score } = data;
    this.percentage = Math.floor(100 * score / total);
  }

  ngOnInit() {
  }

}
