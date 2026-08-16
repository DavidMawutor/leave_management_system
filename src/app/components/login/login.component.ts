import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  /** Which login tab is active. Driven by route data so /login and /admin/login preselect it. */
  mode: UserRole = (this.route.snapshot.data['mode'] as UserRole) ?? 'user';

  username = '';
  password = '';
  errorMessage = '';
  submitting = false;

  get testCredential() {
    return this.authService.testCredentials[this.mode];
  }

  switchMode(mode: UserRole): void {
    if (this.mode === mode) {
      return;
    }
    this.errorMessage = '';
    this.router.navigateByUrl(mode === 'admin' ? '/admin/login' : '/login');
  }

  fillTestCredentials(): void {
    this.username = this.testCredential.username;
    this.password = this.testCredential.password;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.submitting = true;

    const success = this.authService.login(this.username, this.password, this.mode);

    if (success) {
      this.router.navigateByUrl(this.mode === 'admin' ? '/admin' : '/');
    } else {
      this.errorMessage = 'Incorrect username or password. Try the test credentials below.';
    }

    this.submitting = false;
  }
}
