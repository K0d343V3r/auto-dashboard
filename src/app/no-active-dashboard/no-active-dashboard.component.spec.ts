import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoActiveDashboardComponent } from './no-active-dashboard.component';

describe('NoActiveDashboardComponent', () => {
  let component: NoActiveDashboardComponent;
  let fixture: ComponentFixture<NoActiveDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoActiveDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoActiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
