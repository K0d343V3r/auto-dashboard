import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlHostComponent } from './control-host.component';

describe('ControlHostComponent', () => {
  let component: ControlHostComponent;
  let fixture: ComponentFixture<ControlHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
