/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomvalidationService } from './customvalidation.service';

describe('Service: Customvalidation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomvalidationService]
    });
  });

  it('should ...', inject([CustomvalidationService], (service: CustomvalidationService) => {
    expect(service).toBeTruthy();
  }));
});
