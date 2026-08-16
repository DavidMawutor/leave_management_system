import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthUser, TestCredential, UserRole } from '../models/auth.model';

const SESSION_KEY = 'leave_app_session';

/**
 * TEMPORARY hard-coded test accounts for the demo/testing phase.
 *
 * TODO (backend integration): once a database is connected, replace `login()` below with a real
 * API call, e.g.:
 *   POST /api/auth/login  { username, password, role }  ->  { token, user }
 * and swap the credential lookup for a server-verified response. The public method signatures
 * (`login`, `logout`, `hasRole`, `currentUser`) are designed to stay the same so the rest of the
 * app (guards, components) will not need to change.
 */
const TEST_ACCOUNTS: Record<UserRole, TestCredential> = {
  user: { username: 'user', password: 'user123' },
  admin: { username: 'admin', password: 'admin123' }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private _currentUser = signal<AuthUser | null>(this.restoreSession());

  /** Reactive, read-only handle on the currently authenticated user (or null). */
  readonly currentUser = this._currentUser.asReadonly();

  /** Exposed so the login screen can display/autofill the demo credentials. */
  readonly testCredentials: Record<UserRole, TestCredential> = TEST_ACCOUNTS;

  private restoreSession(): AuthUser | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  /**
   * Attempts to authenticate against the mock TEST_ACCOUNTS table for the given role.
   * Returns true and persists the session on success, false otherwise.
   */
  login(username: string, password: string, role: UserRole): boolean {
    const expected = TEST_ACCOUNTS[role];
    const isValid =
      !!expected &&
      username.trim().toLowerCase() === expected.username.toLowerCase() &&
      password === expected.password;

    if (isValid) {
      const user: AuthUser = { username: username.trim(), role };
      this._currentUser.set(user);
      if (this.isBrowser) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    }

    return isValid;
  }

  logout(): void {
    this._currentUser.set(null);
    if (this.isBrowser) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }
}
