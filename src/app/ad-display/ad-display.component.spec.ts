import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDisplayComponent } from './ad-display.component';

describe('AdDisplayComponent', () => {
  let component: AdDisplayComponent;
  let fixture: ComponentFixture<AdDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
