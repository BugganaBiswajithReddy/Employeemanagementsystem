export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Leave'
  | 'Out of Station'
  | 'Half Day'
  | 'Late Arrival';

export type EmploymentStatus = 'Active' | 'Inactive';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface Employee {
  id: string; // e.g. "EMP001"
  name: string;
  mobile: string;
  email: string;
  department: string;
  designation: string;
  dateOfJoining: string; // YYYY-MM-DD
  status: EmploymentStatus;
  bankDetails: BankDetails;
  basicSalary: number;
  dearnessAllowance: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  otherAllowances: number;
  insuranceContribution: number;
  otherDeductions: number;
  leaveBalance: number;
  password?: string;
  hasChangedPassword?: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime: string; // e.g. "09:00 AM"
  checkOutTime: string; // e.g. "05:00 PM"
  workingHours: number; // e.g. 8
  remarks?: string;
}

export type ActivityType =
  | 'EMPLOYEE_ADDED'
  | 'EMPLOYEE_UPDATED'
  | 'EMPLOYEE_DELETED'
  | 'ATTENDANCE_MARKED';

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO or human readable
  type: ActivityType;
  description: string;
  employeeName?: string;
  employeeId?: string;
}

export type SidebarTab = 'dashboard' | 'employees' | 'attendance' | 'projects' | 'payslips' | 'analytics' | 'reports';

export type ProjectStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
  status: ProjectStatus;
  assignedEmployees: string[]; // array of employee IDs
  createdAt: string;
}


export interface Payslip {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  dearnessAllowance: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  otherAllowances: number;
  totalEarnings: number;
  insuranceContribution: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: 'Pending' | 'Processing' | 'Paid';
  paymentDate?: string; // YYYY-MM-DD
  startDate?: string;
  endDate?: string;
  payableDays?: number;
  totalDays?: number;
}

export interface Report {
  id: string;
  name: string;
  type: 'Employee' | 'Attendance' | 'Salary' | 'Department';
  generatedOn: string;
  generatedBy: string;
}
