import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BingMapPComponent } from './bing-map-p.component';

describe('BingMapPComponent', () => {
  let component: BingMapPComponent;
  let fixture: ComponentFixture<BingMapPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BingMapPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BingMapPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
