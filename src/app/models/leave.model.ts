export interface LeaveApplication {
  formId: string;
  fullname: string;
  contact: string;
  email: string;
  department: string;
  role: string;
  idNumber: string;
  reason: string;
  effectiveDate: string;
  resumingDate: string;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Denied';
}