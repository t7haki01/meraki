import { TestBed } from '@angular/core/testing';

import { BingmapService } from './bingmap.service';

describe('BingmapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BingmapService = TestBed.get(BingmapService);
    expect(service).toBeTruthy();
  });
});
