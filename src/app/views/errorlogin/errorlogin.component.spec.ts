import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorloginComponent } from './errorlogin.component';

describe('ErrorloginComponent', () => {
  let component: ErrorloginComponent;
  let fixture: ComponentFixture<ErrorloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
