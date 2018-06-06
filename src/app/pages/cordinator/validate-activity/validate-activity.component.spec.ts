import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateActivityComponent } from './validate-activity.component';

describe('ValidateActivityComponent', () => {
  let component: ValidateActivityComponent;
  let fixture: ComponentFixture<ValidateActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
