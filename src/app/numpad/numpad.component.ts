import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss']
})
export class NumpadComponent implements OnInit {
  @Input('running') toggle = false;
  @Output() numpadEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  clickHandler(code) {

    if (['stop', 'go'].includes(code)) {
      this.toggle = !this.toggle;
    }

    this.numpadEvent.emit({
      data: code
    });
  }

}
