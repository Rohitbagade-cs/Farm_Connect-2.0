import { TestBed } from '@angular/core/testing';

import { LivestockService } from './livestock.service';

describe('LivestockService', () => {
  let service: LivestockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivestockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
