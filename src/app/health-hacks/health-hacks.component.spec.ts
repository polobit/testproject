import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHacksComponent } from './health-hacks.component';

describe('HealthHacksComponent', () => {
  let component: HealthHacksComponent;
  let fixture: ComponentFixture<HealthHacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthHacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
