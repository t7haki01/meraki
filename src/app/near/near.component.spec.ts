import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearComponent } from './near.component';

describe('NearComponent', () => {
  let component: NearComponent;
  let fixture: ComponentFixture<NearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
