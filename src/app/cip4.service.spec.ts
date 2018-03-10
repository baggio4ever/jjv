import { TestBed, inject } from '@angular/core/testing';

import { Cip4Service } from './cip4.service';

describe('Cip4Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Cip4Service]
    });
  });

  it('should be created', inject([Cip4Service], (service: Cip4Service) => {
    expect(service).toBeTruthy();
  }));
});
