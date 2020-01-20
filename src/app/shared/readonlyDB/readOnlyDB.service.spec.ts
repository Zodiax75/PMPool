/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReadOnlyDBService } from './readOnlyDB.service';

describe('Service: ReadOnlyDB', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReadOnlyDBService]
    });
  });

  it('should ...', inject([ReadOnlyDBService], (service: ReadOnlyDBService) => {
    expect(service).toBeTruthy();
  }));
});
