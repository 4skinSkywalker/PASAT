import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndgameComponent } from './endgame.component';

describe('EndgameComponent', () => {
  let component: EndgameComponent;
  let fixture: ComponentFixture<EndgameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndgameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
