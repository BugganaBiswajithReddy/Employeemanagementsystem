import { Employee, AttendanceRecord, ActivityLog, Payslip, Report, Project } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_ACTIVITIES } from '../data/mockData';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export const StorageService = {
  getEmployees(): Employee[] {
    return [];
  },

  saveEmployees(data: any[], fromSync = false): void {
    if (!fromSync) {
      data.forEach(item => {
        setDoc(doc(db, 'employees', item.id), item).catch(console.error);
      });
    }
  },

  deleteEmployee(id: string): void {
    deleteDoc(doc(db, 'employees', id)).catch(console.error);
  },

  getAttendance(): AttendanceRecord[] {
    return [];
  },

  saveAttendance(data: any[], fromSync = false): void {
    if (!fromSync) {
      data.forEach(item => {
        setDoc(doc(db, 'attendance', item.id), item).catch(console.error);
      });
    }
  },

  deleteAttendance(id: string): void {
    deleteDoc(doc(db, 'attendance', id)).catch(console.error);
  },

  getActivities(): ActivityLog[] {
    return [];
  },

  saveActivities(data: any[], fromSync = false): void {
    if (!fromSync) {
      data.forEach(item => {
        setDoc(doc(db, 'activities', item.id), item).catch(console.error);
      });
    }
  },

  deleteActivity(id: string): void {
    deleteDoc(doc(db, 'activities', id)).catch(console.error);
  },

  getPayslips(): Payslip[] {
    return [];
  },

  savePayslips(data: any[], fromSync = false): void {
    if (!fromSync) {
      data.forEach(item => {
        setDoc(doc(db, 'payslips', item.id), item).catch(console.error);
      });
    }
  },

  deletePayslip(id: string): void {
    deleteDoc(doc(db, 'payslips', id)).catch(console.error);
  },


  getProjects(): Project[] {
    return [];
  },

  saveProjects(data: any[], fromSync = false): void {
    if (!fromSync) {
      data.forEach(item => {
        setDoc(doc(db, 'projects', item.id), item).catch(console.error);
      });
    }
  },

  deleteProject(id: string): void {
    deleteDoc(doc(db, 'projects', id)).catch(console.error);
  },

  getReports(): Report[] {
    return [];
  },

  saveReports(data: any[], fromSync = false): void {
    if (!fromSync) {
      data.forEach(item => {
        setDoc(doc(db, 'reports', item.id), item).catch(console.error);
      });
    }
  },

  deleteReport(id: string): void {
    deleteDoc(doc(db, 'reports', id)).catch(console.error);
  },

  addActivity(
    type: ActivityLog['type'],
    description: string,
    employeeName?: string,
    employeeId?: string
  ): ActivityLog[] {
    // Activities will be updated via React state and Firebase, this method is no longer used for local mutation
    return [];
  },

  resetAll(): void {
    // No-op
  }
};
