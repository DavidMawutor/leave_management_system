/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';

import { LeaveStorageService } from './leave-storage.service';

describe('LeaveStorageService', () => {
  let service: LeaveStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
