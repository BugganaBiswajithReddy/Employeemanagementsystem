import { Employee, AttendanceRecord, Payslip } from '../types';

export const calculateSalary = (
  emp: Employee,
  attendanceRecords: AttendanceRecord[],
  startDate: string,
  endDate: string
): Omit<Payslip, 'id'> | null => {
  if (!emp || !startDate || !endDate) return null;

  const myAttendance = attendanceRecords.filter(a => 
    a.employeeId === emp.id && 
    a.date >= startDate && 
    a.date <= endDate
  );

  let payableDays = 0;
  myAttendance.forEach(a => {
    if (['Present', 'Late Arrival'].includes(a.status)) {
      payableDays += 1;
    } else if (a.status === 'Half Day') {
      payableDays += 0.5;
    }
  });

  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
  
  // Determine the number of days in the month to calculate the daily rate of the monthly salary
  const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();

  // Ratio of monthly salary to pay
  const ratio = daysInMonth > 0 ? payableDays / daysInMonth : 0;

  // Convert Annual Salary components to Monthly by dividing by 12, then multiply by ratio
  const basic = ((emp.basicSalary || 0) / 12) * ratio;
  const da = ((emp.dearnessAllowance || 0) / 12) * ratio;
  const hra = ((emp.houseRentAllowance || 0) / 12) * ratio;
  const medical = ((emp.medicalAllowance || 0) / 12) * ratio;
  const other = ((emp.otherAllowances || 0) / 12) * ratio;
  const totalEarnings = basic + da + hra + medical + other;
  
  const insurance = ((emp.insuranceContribution || 0) / 12) * ratio;
  const otherDeductions = ((emp.otherDeductions || 0) / 12) * ratio;
  const totalDeductions = insurance + otherDeductions;
  
  const net = totalEarnings - totalDeductions;
  const monthStr = startDate.slice(0, 7);

  return {
    employeeId: emp.id,
    month: monthStr,
    startDate,
    endDate,
    payableDays,
    totalDays,
    basicSalary: basic,
    dearnessAllowance: da,
    houseRentAllowance: hra,
    medicalAllowance: medical,
    otherAllowances: other,
    insuranceContribution: insurance,
    otherDeductions: otherDeductions,
    totalDeductions: totalDeductions,
    totalEarnings: totalEarnings,
    netSalary: net,
    paymentStatus: 'Pending'
  };
};
