import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Employee, AttendanceRecord } from '../types';

export function exportAttendanceToPDF(
  records: AttendanceRecord[],
  employees: Employee[],
  selectedDate: string
) {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Workforce HR - Attendance Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated Date: ${selectedDate} | Total Records: ${records.length}`, 14, 28);

  // Table Columns
  let startY = 38;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ID', 14, startY);
  doc.text('Employee Name', 35, startY);
  doc.text('Department', 85, startY);
  doc.text('Status', 130, startY);
  doc.text('In / Out', 160, startY);
  doc.text('Hours', 188, startY);

  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, startY + 2, 200, startY + 2);

  let currentY = startY + 10;
  doc.setFont('helvetica', 'normal');

  records.forEach((rec) => {
    const emp = employees.find((e) => e.id === rec.employeeId);
    const empName = emp ? emp.name : rec.employeeId;
    const dept = emp ? emp.department : 'General';

    doc.text(rec.employeeId, 14, currentY);
    doc.text(empName.slice(0, 24), 35, currentY);
    doc.text(dept.slice(0, 18), 85, currentY);
    doc.text(rec.status, 130, currentY);
    doc.text(`${rec.checkInTime} - ${rec.checkOutTime}`, 160, currentY);
    doc.text(`${rec.workingHours} hrs`, 188, currentY);

    currentY += 8;

    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
  });

  doc.save(`Attendance_Report_${selectedDate}.pdf`);
}

export function exportAttendanceToExcel(
  records: AttendanceRecord[],
  employees: Employee[],
  selectedDate: string
) {
  const data = records.map((rec) => {
    const emp = employees.find((e) => e.id === rec.employeeId);
    return {
      'Employee ID': rec.employeeId,
      'Employee Name': emp ? emp.name : '',
      Department: emp ? emp.department : '',
      Designation: emp ? emp.designation : '',
      Date: rec.date,
      Status: rec.status,
      'Check-In Time': rec.checkInTime,
      'Check-Out Time': rec.checkOutTime,
      'Working Hours': rec.workingHours,
      Remarks: rec.remarks || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  XLSX.writeFile(workbook, `Attendance_Export_${selectedDate}.xlsx`);
}
