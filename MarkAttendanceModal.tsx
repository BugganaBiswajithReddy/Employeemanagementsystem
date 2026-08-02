import React, { useState, useEffect } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';
import { X, Check, Save, Clock, Calendar } from 'lucide-react';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  selectedDate: string;
  onSaveAttendance: (records: AttendanceRecord[], targetDate: string) => void;
}

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  onClose,
  employees,
  attendanceRecords,
  selectedDate,
  onSaveAttendance,
}) => {
  const [targetDate, setTargetDate] = useState(selectedDate);
  const activeEmployees = employees.filter((e) => e.status === 'Active');

  // Local draft records for targetDate
  const [drafts, setDrafts] = useState<Record<string, { status: AttendanceStatus; checkIn: string; checkOut: string; hours: number; remarks: string }>>({});

  useEffect(() => {
    if (isOpen) {
      setTargetDate(selectedDate);
      initDraftsForDate(selectedDate);
    }
  }, [isOpen, selectedDate, employees, attendanceRecords]);

  const initDraftsForDate = (dateStr: string) => {
    const existingMap = new Map<string, AttendanceRecord>();
    attendanceRecords.forEach((r) => {
      if (r.date === dateStr) {
        existingMap.set(r.employeeId, r);
      }
    });

    const initial: Record<string, { status: AttendanceStatus; checkIn: string; checkOut: string; hours: number; remarks: string }> = {};

    activeEmployees.forEach((emp) => {
      const rec = existingMap.get(emp.id);
      if (rec) {
        initial[emp.id] = {
          status: rec.status,
          checkIn: rec.checkInTime,
          checkOut: rec.checkOutTime,
          hours: rec.workingHours,
          remarks: rec.remarks || '',
        };
      } else {
        initial[emp.id] = {
          status: 'Present',
          checkIn: '09:00 AM',
          checkOut: '05:30 PM',
          hours: 8.5,
          remarks: 'Standard Shift',
        };
      }
    });

    setDrafts(initial);
  };

  if (!isOpen) return null;

  const handleDateChange = (newDate: string) => {
    setTargetDate(newDate);
    initDraftsForDate(newDate);
  };

  const updateDraft = (
    empId: string,
    field: 'status' | 'checkIn' | 'checkOut' | 'hours' | 'remarks',
    value: any
  ) => {
    setDrafts((prev) => {
      const current = prev[empId] || {
        status: 'Present',
        checkIn: '09:00 AM',
        checkOut: '05:30 PM',
        hours: 8.5,
        remarks: '',
      };

      let updated = { ...current, [field]: value };

      // Auto adjust hours based on status
      if (field === 'status') {
        if (value === 'Leave' || value === 'Absent') {
          updated.checkIn = '-';
          updated.checkOut = '-';
          updated.hours = 0;
        } else if (value === 'Half Day') {
          updated.checkIn = '09:00 AM';
          updated.checkOut = '01:00 PM';
          updated.hours = 4.0;
        } else if (value === 'Present' && current.checkIn === '-') {
          updated.checkIn = '09:00 AM';
          updated.checkOut = '05:30 PM';
          updated.hours = 8.5;
        }
      }

      return { ...prev, [empId]: updated };
    });
  };

  const handleSetAllStatus = (status: AttendanceStatus) => {
    const next: typeof drafts = {};
    activeEmployees.forEach((emp) => {
      let checkIn = drafts[emp.id]?.checkIn || '09:00 AM';
      let checkOut = drafts[emp.id]?.checkOut || '05:30 PM';
      let hours = drafts[emp.id]?.hours || 8.5;

      if (status === 'Leave' || status === 'Absent') {
        checkIn = '-';
        checkOut = '-';
        hours = 0;
      } else if (status === 'Half Day') {
        checkIn = '09:00 AM';
        checkOut = '01:00 PM';
        hours = 4.0;
      } else if (status === 'Present') {
        checkIn = '09:00 AM';
        checkOut = '05:30 PM';
        hours = 8.5;
      }

      next[emp.id] = {
        status,
        checkIn,
        checkOut,
        hours,
        remarks: status === 'Present' ? 'Marked in batch' : `${status} batch entry`,
      };
    });
    setDrafts(next);
  };

  const handleSave = () => {
    const updatedRecords: AttendanceRecord[] = activeEmployees.map((emp) => {
      const draft = drafts[emp.id] || {
        status: 'Present',
        checkIn: '09:00 AM',
        checkOut: '05:30 PM',
        hours: 8.5,
        remarks: '',
      };

      return {
        id: `ATT-${emp.id}-${targetDate}`,
        employeeId: emp.id,
        date: targetDate,
        status: draft.status,
        checkInTime: draft.checkIn,
        checkOutTime: draft.checkOut,
        workingHours: draft.hours,
        remarks: draft.remarks,
      };
    });

    onSaveAttendance(updatedRecords, targetDate);
    onClose();
  };

  const statuses: AttendanceStatus[] = [
    'Present',
    'Absent',
    'Leave',
    'Out of Station',
    'Half Day',
    'Late Arrival',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>✅ Mark Employee Attendance</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select date and set attendance status for active employees.
            </p>
          </div>
          <button type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector & Quick Setters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <label className="text-xs font-bold text-slate-700">Attendance Date:</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Quick Mark All:</span>
            <button
              type="button"
              onClick={() => handleSetAllStatus('Present')}
              className="px-2.5 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-semibold"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleSetAllStatus('Leave')}
              className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-semibold"
            >
              All Leave
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Check-In</th>
                <th className="py-2.5 px-3">Check-Out</th>
                <th className="py-2.5 px-3 text-right">Hours</th>
                <th className="py-2.5 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {activeEmployees.map((emp) => {
                const draft = drafts[emp.id] || {
                  status: 'Present',
                  checkIn: '09:00 AM',
                  checkOut: '05:30 PM',
                  hours: 8.5,
                  remarks: '',
                };

                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{emp.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{emp.id} • {emp.department}</div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={draft.status}
                        onChange={(e) => updateDraft(emp.id, 'status', e.target.value as AttendanceStatus)}
                        className="px-2 py-1 text-xs rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={draft.checkIn}
                        onChange={(e) => updateDraft(emp.id, 'checkIn', e.target.value)}
                        className="w-24 px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-800 font-mono focus:outline-none"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={draft.checkOut}
                        onChange={(e) => updateDraft(emp.id, 'checkOut', e.target.value)}
                        className="w-24 px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-800 font-mono focus:outline-none"
                      />
                    </td>

                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        step="0.25"
                        value={draft.hours}
                        onChange={(e) => updateDraft(emp.id, 'hours', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-900 font-mono text-right font-bold focus:outline-none"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="Optional note"
                        value={draft.remarks}
                        onChange={(e) => updateDraft(emp.id, 'remarks', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded-md border border-slate-200 text-slate-700 focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Recording attendance for <strong className="text-slate-800">{activeEmployees.length}</strong> active staff.
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-save-attendance-batch"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Attendance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
