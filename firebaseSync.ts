import { collection, doc, setDoc, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { StorageService } from './storage';
import { Employee, AttendanceRecord, ActivityLog, Payslip, Report, Project } from '../types';


enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // DO NOT throw error here to avoid crashing the React app on transient or permission errors
  // throw new Error(JSON.stringify(errInfo));
}

export const FirebaseSync = {
  subscribe(
    setEmployees: (data: Employee[]) => void,
    setProjects: (data: Project[]) => void,
    setAttendanceRecords: (data: AttendanceRecord[]) => void,
    setActivityLogs: (data: ActivityLog[]) => void,
    setPayslips: (data: Payslip[]) => void,
    setReports: (data: Report[]) => void
  ) {
    const unsubEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Employee);
      setEmployees(data);
      if (data.length > 0) StorageService.saveEmployees(data, true);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'collection'));

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Project);
      setProjects(data);
      if (data.length > 0) StorageService.saveProjects(data, true);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'collection'));

    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      let data = snapshot.docs.map(doc => doc.data() as AttendanceRecord);
      
      // Deduplicate by employeeId and date
      const seen = new Set<string>();
      const duplicates: string[] = [];
      
      // Sort to prefer newer IDs (if multiple records were created for the same day)
      data.sort((a, b) => b.id.localeCompare(a.id));
      
      data = data.filter(a => {
        const key = `${a.employeeId}-${a.date}`;
        if (seen.has(key)) {
          duplicates.push(a.id);
          return false;
        }
        seen.add(key);
        return true;
      });

      // Cleanup duplicates from firestore
      duplicates.forEach(id => {
        deleteDoc(doc(db, 'attendance', id)).catch(console.error);
      });

      setAttendanceRecords(data);
      if (data.length > 0) StorageService.saveAttendance(data, true);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'collection'));

    const unsubActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as ActivityLog);
      setActivityLogs(data);
      if (data.length > 0) StorageService.saveActivities(data, true);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'collection'));

    const unsubPayslips = onSnapshot(collection(db, 'payslips'), (snapshot) => {
      let data = snapshot.docs.map(doc => doc.data() as Payslip);
      
      // Remove duplicates by employeeId and month
      const seen = new Set<string>();
      const duplicates: string[] = [];
      data = data.filter(p => {
        const key = `${p.employeeId}-${p.month}`;
        if (seen.has(key)) {
          duplicates.push(p.id);
          return false;
        }
        seen.add(key);
        return true;
      });

      // Cleanup duplicates from firestore
      duplicates.forEach(id => {
        deleteDoc(doc(db, 'payslips', id)).catch(console.error);
      });

      if (data.length > 0) {
        setPayslips(data);
        StorageService.savePayslips(data, true);
      } else {
        setPayslips([]);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'collection'));

    const unsubReports = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Report);
      setReports(data);
      if (data.length > 0) StorageService.saveReports(data, true);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'collection'));

    return () => {
      unsubEmployees();
      unsubProjects();
      unsubAttendance();
      unsubActivities();
      unsubPayslips();
      unsubReports();
    };
  },

  async syncAllToFirebase(
    employees: Employee[],
    projects: Project[],
    attendance: AttendanceRecord[],
    activities: ActivityLog[],
    payslips: Payslip[],
    reports: Report[]
  ) {
    // This function can be used to push all local data to Firebase initially if needed
    for (const emp of employees) {
      await setDoc(doc(db, 'employees', emp.id), emp);
    }
    for (const proj of projects) {
      await setDoc(doc(db, 'projects', proj.id), proj);
    }
    for (const att of attendance) {
      await setDoc(doc(db, 'attendance', att.id), att);
    }
    for (const act of activities) {
      await setDoc(doc(db, 'activities', act.id), act);
    }
    for (const slip of payslips) {
      await setDoc(doc(db, 'payslips', slip.id), slip);
    }
    for (const rep of reports) {
      await setDoc(doc(db, 'reports', rep.id), rep);
    }
  }
};
