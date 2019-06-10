import { TestBed } from '@angular/core/testing';

import { MapLoaderService } from './map-loader.service';

describe('MapLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapLoaderService = TestBed.get(MapLoaderService);
    expect(service).toBeTruthy();
  });
});
