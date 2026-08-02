import React from 'react';
import { Employee, AttendanceRecord } from '../types';
import { X, User, Briefcase, CreditCard, DollarSign, CalendarCheck, CheckCircle2, Clock, CalendarOff } from 'lucide-react';

interface EmployeeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  attendanceRecords: AttendanceRecord[];
}

export const EmployeeViewModal: React.FC<EmployeeViewModalProps> = ({
  isOpen,
  onClose,
  employee,
  attendanceRecords,
}) => {
  if (!isOpen || !employee) return null;

  // Filter attendance logs for this employee
  const empAttendance = attendanceRecords.filter((r) => r.employeeId === employee.id);
  const totalLoggedDays = empAttendance.length;
  const presentDays = empAttendance.filter((r) => r.status === 'Present' || r.status === 'Late Arrival' || r.status === 'Half Day').length;
  const leaveDays = empAttendance.filter((r) => r.status === 'Leave').length;
  const outOfStationDays = empAttendance.filter((r) => r.status === 'Out of Station').length;
  const absentDays = empAttendance.filter((r) => r.status === 'Absent').length;

  const attendanceRate = totalLoggedDays > 0 ? Math.round((presentDays / totalLoggedDays) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {employee.name ? employee.name.charAt(0) : 'E'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{employee.name || 'Employee'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    employee.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-700 text-slate-300 border-slate-600'
                  }`}
                >
                  {employee.status}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {employee.id} • {employee.designation}
              </p>
            </div>
          </div>
          <button type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Personal Information */}
          <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 mb-3">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Personal Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Full Name</span>
                <span className="text-slate-800 font-semibold">{employee.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Employee ID</span>
                <span className="text-slate-800 font-mono font-semibold">{employee.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mobile Number</span>
                <span className="text-slate-800 font-medium">{employee.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="text-slate-800 font-medium">{employee.email}</span>
              </div>
            </div>
          </section>

          {/* Section 2: Employment Information */}
          <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Employment Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="text-slate-800 font-semibold">{employee.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Designation</span>
                <span className="text-slate-800 font-semibold">{employee.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date of Joining</span>
                <span className="text-slate-800 font-medium">{employee.dateOfJoining}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Employment Status</span>
                <span className="text-slate-800 font-medium">{employee.status}</span>
              </div>
            </div>
          </section>

          {/* Section 3: Bank Details */}
          <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 mb-3">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Bank Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Bank Name</span>
                <span className="text-slate-800 font-semibold">{employee.bankDetails?.bankName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Account Number</span>
                <span className="text-slate-800 font-mono font-medium">{employee.bankDetails?.accountNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">IFSC / Swift Code</span>
                <span className="text-slate-800 font-mono font-medium">{employee.bankDetails?.ifscCode || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Section 4: Salary Details */}
          <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 mb-3">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>Salary Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Basic Annual Salary</span>
                <span className="text-base font-bold text-slate-900">${employee.basicSalary.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Estimated Monthly Basic</span>
                <span className="text-sm font-semibold text-slate-700">${Math.round(employee.basicSalary / 12).toLocaleString()} / month</span>
              </div>
            </div>
          </section>

          {/* Section 5: Attendance Summary */}
          <section className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Attendance Summary</span>
              </h4>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                {attendanceRate}% Present Rate
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">Present Days</div>
                <div className="text-base font-bold text-emerald-600">{presentDays}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">On Leave</div>
                <div className="text-base font-bold text-amber-600">{leaveDays}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">Out of Station</div>
                <div className="text-base font-bold text-purple-600">{outOfStationDays}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">Leave Balance</div>
                <div className="text-base font-bold text-sky-600">{employee.leaveBalance ?? 12}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">Absent</div>
                <div className="text-base font-bold text-rose-600">{absentDays}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
