import { TestBed } from '@angular/core/testing';

import { DiagnoticsService } from './diagnotics.service';

describe('DiagnoticsService', () => {
  let service: DiagnoticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnoticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
