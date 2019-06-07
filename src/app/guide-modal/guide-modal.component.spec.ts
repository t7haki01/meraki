import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideModalComponent } from './guide-modal.component';

describe('GuideModalComponent', () => {
  let component: GuideModalComponent;
  let fixture: ComponentFixture<GuideModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
