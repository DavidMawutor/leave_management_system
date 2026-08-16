import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveStorageService } from '../../services/leave-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [ReactiveFormsModule], // No CommonModule needed!
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss']
})
export class StaffFormComponent implements OnInit {
  // Using modern Angular dependency injection pattern
  private storageService = inject(LeaveStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  leaveForm!: FormGroup;

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.leaveForm = new FormGroup({
      fullname: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      idNumber: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
      effectiveDate: new FormControl('', [Validators.required]),
      resumingDate: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.storageService.addApplication(this.leaveForm.value);
      alert('Your application has been saved to processing logs.');
      this.onClear();
    }
  }

  onClear(): void {
    this.leaveForm.reset();
  }

  onClose(): void {
    if(confirm('Discard changes?')) {
      this.onClear();
    }
  }

  triggerDownload(): void {
    this.storageService.exportToCSV();
  }

  switchToAdmin(): void {
    this.router.navigateByUrl('/admin/login');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
