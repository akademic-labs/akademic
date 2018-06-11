import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CordinatorComponent } from './cordinator.component';

describe('CordinatorComponent', () => {
  let component: CordinatorComponent;
  let fixture: ComponentFixture<CordinatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CordinatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
