export type UserRole = 'user' | 'admin';

export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface TestCredential {
  username: string;
  password: string;
}
