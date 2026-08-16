import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logs in with valid test credentials', () => {
    expect(service.login('user', 'user123', 'user')).toBeTrue();
    expect(service.hasRole('user')).toBeTrue();
  });

  it('rejects invalid credentials', () => {
    expect(service.login('user', 'wrongpass', 'user')).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('logs out', () => {
    service.login('admin', 'admin123', 'admin');
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
