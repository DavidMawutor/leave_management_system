import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaveApplication } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveStorageService {
  private STORAGE_KEY = 'staff_leave_applications';
  private appsSubject = new BehaviorSubject<LeaveApplication[]>([]);
  public applications$: Observable<LeaveApplication[]> = this.appsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.appsSubject.next(JSON.parse(data));
    } else {
      // Seed initial mock data matching your design specifications
      const initialSeed: LeaveApplication[] = [
        {
          formId: '019',
          fullname: 'John Bardy Akrapovic',
          contact: '024 453 2250',
          email: 'johnbardyakra@gmail.com',
          department: 'Sales and marketing',
          role: 'Marketing Analyst',
          idNumber: '00244',
          reason: 'Sick leave. Required to attend a mandatory medical check up.',
          effectiveDate: '2026-07-22',
          resumingDate: '2026-08-05',
          applicationDate: '2026-07-20',
          status: 'Pending'
        },
        {
          formId: '020',
          fullname: 'Selina Nana Akua',
          contact: '055 111 2222',
          email: 'selina.akua@company.com',
          department: 'Research Department',
          role: 'Research Lead',
          idNumber: '00246',
          reason: 'Standard annual leave allocation.',
          effectiveDate: '2026-06-05',
          resumingDate: '2026-06-12',
          applicationDate: '2026-06-01',
          status: 'Approved'
        }
      ];
      this.saveToStorage(initialSeed);
    }
  }

  private saveToStorage(apps: LeaveApplication[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(apps));
    this.appsSubject.next(apps);
  }

  public addApplication(app: Omit<LeaveApplication, 'formId' | 'applicationDate' | 'status'>): void {
    const current = this.appsSubject.value;
    const nextId = String(current.length + 1).padStart(3, '0');
    const today = new Date().toISOString().split('T')[0];

    const newApp: LeaveApplication = {
      ...app,
      formId: nextId,
      applicationDate: today,
      status: 'Pending'
    };

    this.saveToStorage([newApp, ...current]);
  }

  public updateStatus(formId: string, status: 'Pending' | 'Approved' | 'Denied'): void {
    const updated = this.appsSubject.value.map(app => 
      app.formId === formId ? { ...app, status } : app
    );
    this.saveToStorage(updated);
  }

  public exportToCSV(): void {
    const headers = ['Form ID', 'Fullname', 'Contact', 'Email', 'Department', 'Role', 'ID Number', 'Reason', 'Effective Date', 'Resuming Date', 'Application Date', 'Status'];
    
    const rows = this.appsSubject.value.map(app => [
      app.formId,
      `"${app.fullname.replace(/"/g, '""')}"`,
      app.contact,
      app.email,
      `"${app.department.replace(/"/g, '""')}"`,
      `"${app.role.replace(/"/g, '""')}"`,
      app.idNumber,
      `"${app.reason.replace(/"/g, '""')}"`,
      app.effectiveDate,
      app.resumingDate,
      app.applicationDate,
      app.status
    ]);

    // Build standard CSV format string
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create download link trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Leave_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}