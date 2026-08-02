import React from 'react';
import { Employee, AttendanceRecord } from '../types';
import { X, Calendar, CheckCircle2, Clock, MapPin, CalendarOff, AlertCircle } from 'lucide-react';

interface AttendanceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  attendanceRecords: AttendanceRecord[];
}

export const AttendanceViewModal: React.FC<AttendanceViewModalProps> = ({
  isOpen,
  onClose,
  employee,
  attendanceRecords,
}) => {
  if (!isOpen || !employee) return null;

  // Filter attendance records for this employee
  const empLogs = attendanceRecords.filter((r) => r.employeeId === employee.id);

  const totalWorkingDays = empLogs.length > 0 ? empLogs.length : 22; // Default month baseline if sparse
  const presentDays = empLogs.filter(
    (r) => r.status === 'Present' || r.status === 'Late Arrival' || r.status === 'Half Day'
  ).length;

  const leaveDays = empLogs.filter((r) => r.status === 'Leave').length;
  const outOfStationDays = empLogs.filter((r) => r.status === 'Out of Station').length;

  const leaveHistory = empLogs.filter((r) => r.status === 'Leave');
  const outOfStationHistory = empLogs.filter((r) => r.status === 'Out of Station');

  const monthlyAttendancePercentage =
    totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 100;

  // Calendar matrix generator for current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Create calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Helper to get status for a day
  const getDayStatus = (dayNum: number) => {
    const monthStr = (currentMonth + 1).toString().padStart(2, '0');
    const dayStr = dayNum.toString().padStart(2, '0');
    const dateFormatted = `${currentYear}-${monthStr}-${dayStr}`;

    const rec = empLogs.find((r) => r.date === dateFormatted);
    return rec ? rec.status : null;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500 text-white font-bold';
      case 'Late Arrival':
        return 'bg-blue-500 text-white font-bold';
      case 'Half Day':
        return 'bg-indigo-500 text-white font-bold';
      case 'Leave':
        return 'bg-amber-500 text-white font-bold';
      case 'Out of Station':
        return 'bg-purple-500 text-white font-bold';
      case 'Absent':
        return 'bg-rose-500 text-white font-bold';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {employee.name ? employee.name.charAt(0) : 'E'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Detailed Attendance: {employee.name || 'Employee'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {employee.id} • {employee.department} • {employee.designation}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 text-center">
              <div className="text-[11px] font-semibold text-blue-700 uppercase">Monthly Attendance</div>
              <div className="text-2xl font-bold text-blue-900 mt-0.5">{monthlyAttendancePercentage}%</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Working Days</div>
              <div className="text-2xl font-bold text-slate-800 mt-0.5">{totalWorkingDays}</div>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 text-center">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase">Total Present Days</div>
              <div className="text-2xl font-bold text-emerald-800 mt-0.5">{presentDays}</div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 text-center">
              <div className="text-[11px] font-semibold text-amber-700 uppercase">Total Leave Days</div>
              <div className="text-2xl font-bold text-amber-800 mt-0.5">{leaveDays}</div>
            </div>
          </div>

          {/* Attendance Calendar */}
          <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  Attendance Calendar ({today.toLocaleString('default', { month: 'long' })} {currentYear})
                </span>
              </h4>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-[10px] font-medium text-slate-600">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Present</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Leave</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>Out of Station</span>
                </span>
              </div>
            </div>

            {/* Days Grid Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase py-1 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 mt-2">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-8"></div>;
                }

                const status = getDayStatus(day);
                const colorClass = getStatusColor(status);

                return (
                  <div
                    key={`day-${day}`}
                    className={`h-8 rounded-lg flex items-center justify-center text-xs transition-transform hover:scale-105 ${colorClass}`}
                    title={status ? `Day ${day}: ${status}` : `Day ${day}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Leave & Out of Station History */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Leave History */}
            <section className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <h4 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5 uppercase mb-2">
                <CalendarOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Leave History</span>
              </h4>
              {leaveHistory.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No leave records registered.</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {leaveHistory.map((l) => (
                    <div key={l.id} className="p-2 rounded-lg bg-white border border-amber-200 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{l.date}</span>
                        <span className="text-amber-600 font-bold">Approved Leave</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{l.remarks || 'Casual leave'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Out-of-Station History */}
            <section className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <h4 className="text-xs font-bold text-purple-900 flex items-center space-x-1.5 uppercase mb-2">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                <span>Out-of-Station History</span>
              </h4>
              {outOfStationHistory.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No out-of-station records.</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {outOfStationHistory.map((o) => (
                    <div key={o.id} className="p-2 rounded-lg bg-white border border-purple-200 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{o.date}</span>
                        <span className="text-purple-600 font-bold">Off-site</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{o.remarks || 'Client visit'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
