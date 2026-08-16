import { Routes } from '@angular/router';
import { StaffFormComponent } from './components/staff-form/staff-form.component';
import { AdminApprovalComponent } from './components/admin-approval/admin-approval.component';
import { LoginComponent } from './components/login/login.component';
import { userGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 1. Staff/user landing page — requires a 'user' session, otherwise redirected to /login
  { path: '', component: StaffFormComponent, canActivate: [userGuard] },

  // 2. Staff login screen (also reachable by switching tabs from the admin login screen)
  { path: 'login', component: LoginComponent, data: { mode: 'user' } },

  // 3. Admin dashboard (still accessible at localhost:4200/admin) — requires an 'admin' session
  { path: 'admin', component: AdminApprovalComponent, canActivate: [adminGuard] },

  // 4. Admin login screen (also reachable by switching tabs from the staff login screen)
  { path: 'admin/login', component: LoginComponent, data: { mode: 'admin' } },

  // 5. Fallback redirect for stray URLs
  { path: '**', redirectTo: '' }
];
