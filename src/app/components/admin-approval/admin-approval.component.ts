import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { LeaveStorageService } from '../../services/leave-storage.service';
import { AuthService } from '../../services/auth.service';
import { LeaveApplication } from '../../models/leave.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [NgClass, DatePipe], // Clean, fast platform utility elements
  templateUrl: './admin-approval.component.html',
  styleUrls: ['./admin-approval.component.scss']
})
export class AdminApprovalComponent implements OnInit, OnDestroy {
  private storageService = inject(LeaveStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sub!: Subscription;

  allRecords: LeaveApplication[] = [];
  filteredRecords: LeaveApplication[] = [];
  currentTab: 'Pending' | 'Approved' | 'Denied' = 'Pending';
  focusedRecord: LeaveApplication | null = null;

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.sub = this.storageService.applications$.subscribe(data => {
      this.allRecords = data;
      this.filterRecords();
    });
  }

  setTab(tab: 'Pending' | 'Approved' | 'Denied'): void {
    this.currentTab = tab;
    this.focusedRecord = null;
    this.filterRecords();
  }

  private filterRecords(): void {
    this.filteredRecords = this.allRecords.filter(r => r.status === this.currentTab);
    
    // Maintain focused detail view consistency if updating state objects live
    if (this.focusedRecord) {
      const currentUpdate = this.allRecords.find(r => r.formId === this.focusedRecord?.formId);
      this.focusedRecord = currentUpdate || null;
    }
  }

  inspect(record: LeaveApplication): void {
    this.focusedRecord = record;
  }

  closeInspector(): void {
    this.focusedRecord = null;
  }

  updateStatus(outcome: 'Approved' | 'Denied'): void {
    if (this.focusedRecord) {
      this.storageService.updateStatus(this.focusedRecord.formId, outcome);
      this.focusedRecord = null;
    }
  }

  switchToUser(): void {
    this.router.navigateByUrl('/login');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
