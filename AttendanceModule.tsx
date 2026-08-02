import React, { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';
import {
  CheckCircle2,
  XCircle,
  CalendarOff,
  MapPin,
  Clock,
  CalendarCheck,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Edit,
  Eye,
  Calendar,
  ChevronDown,
  Download,
} from 'lucide-react';
import { MarkAttendanceModal } from './MarkAttendanceModal';
import { AttendanceViewModal } from './AttendanceViewModal';
import { exportAttendanceToPDF, exportAttendanceToExcel } from '../utils/exportAttendance';

interface AttendanceModuleProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSaveAttendance: (records: AttendanceRecord[], targetDate: string) => void;
  onUpdateSingleAttendance: (record: AttendanceRecord) => void;
  onShowToast: (msg: string) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  employees,
  attendanceRecords,
  selectedDate,
  onDateChange,
  onSaveAttendance,
  onUpdateSingleAttendance,
  onShowToast,
}) => {
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Modals state
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isEditRecordModalOpen, setIsEditRecordModalOpen] = useState(false);

  // Departments List
  const departments = ['All', 'Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Operations'];

  // Current Records for selected date
  const rawRecordsForDate = attendanceRecords.filter((r) => r.date === selectedDate);
  // Deduplicate by employeeId, keeping the latest one
  const recordsForDateMap = new Map<string, AttendanceRecord>();
  rawRecordsForDate.forEach(r => {
    recordsForDateMap.set(r.employeeId, r);
  });
  const recordsForDate = Array.from(recordsForDateMap.values());

  // Summary Metrics calculation for selected date
  const countPresent = recordsForDate.filter((r) => r.status === 'Present').length;
  const countAbsent = recordsForDate.filter((r) => r.status === 'Absent').length;
  const countLeave = recordsForDate.filter((r) => r.status === 'Leave').length;
  const countOutOfStation = recordsForDate.filter((r) => r.status === 'Out of Station').length;
  const countLateArrivals = recordsForDate.filter((r) => r.status === 'Late Arrival').length;
  const countHalfDay = recordsForDate.filter((r) => r.status === 'Half Day').length;

  // Filtered rows for attendance table
  const filteredRecords = recordsForDate.filter((rec) => {
    const emp = employees.find((e) => e.id === rec.employeeId);
    if (!emp) return false;

    const term = searchTerm.toLowerCase().trim();
    const name = emp.name || '';
    const id = emp.id || '';
    const dept = emp.department || '';

    const matchesSearch =
      !term ||
      name.toLowerCase().includes(term) ||
      id.toLowerCase().includes(term) ||
      dept.toLowerCase().includes(term);

    const matchesDept = selectedDeptFilter === 'All' || emp.department === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'All' || rec.status === selectedStatusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const summaryCards = [
    {
      title: 'Present',
      value: countPresent,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      icon: CheckCircle2,
    },
    {
      title: 'Absent',
      value: countAbsent,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      icon: XCircle,
    },
    {
      title: 'On Leave',
      value: countLeave,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-500 text-white',
      icon: CalendarOff,
    },
    {
      title: 'Out of Station',
      value: countOutOfStation,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeBg: 'bg-purple-600 text-white',
      icon: MapPin,
    },
    {
      title: 'Late Arrivals',
      value: countLateArrivals,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      icon: Clock,
    },
    {
      title: 'Half Day',
      value: countHalfDay,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeBg: 'bg-indigo-600 text-white',
      icon: CalendarCheck,
    },
  ];

  const handleExportPDF = () => {
    exportAttendanceToPDF(filteredRecords, employees, selectedDate);
    onShowToast(`Exported Attendance PDF for ${selectedDate}`);
  };

  const handleExportExcel = () => {
    exportAttendanceToExcel(filteredRecords, employees, selectedDate);
    onShowToast(`Exported Attendance Excel workbook for ${selectedDate}`);
  };

  const openViewAttendanceModal = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setViewingEmployee(emp);
      setIsViewModalOpen(true);
    }
  };

  const openEditAttendanceModal = (record: AttendanceRecord) => {
    setEditingRecord({ ...record });
    setIsEditRecordModalOpen(true);
  };

  const handleSaveSingleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      onUpdateSingleAttendance(editingRecord);
      setIsEditRecordModalOpen(false);
      onShowToast(`Updated attendance record for ${editingRecord.employeeId}`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Attendance Summary Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Attendance Summary for {selectedDate}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Daily Counters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border bg-white shadow-2xs flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{card.title}</span>
                  <div className={`p-1.5 rounded-lg ${card.badgeBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{card.value}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Top Controls & Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* ✅ Mark Attendance */}
            <button
              id="btn-mark-attendance-top"
              onClick={() => setIsMarkModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✅ Mark Attendance</span>
            </button>

            {/* 📅 View Attendance History */}
            <button
              id="btn-view-attendance-history"
              onClick={() => {
                if (employees.length > 0) openViewAttendanceModal(employees[0].id);
              }}
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>📅 View Attendance History</span>
            </button>

            {/* 📤 Export Attendance (PDF / Excel) */}
            <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
              <button
                id="btn-export-pdf"
                onClick={handleExportPDF}
                title="Export Attendance as PDF"
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              <button
                id="btn-export-excel"
                onClick={handleExportExcel}
                title="Export Attendance as Excel"
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Date Selectors */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Date Filter */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-slate-800 focus:outline-none font-semibold"
              />
            </div>

            {/* 🔍 Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Name, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ⚙ Filter Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    Dept: {dept}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Status: All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">On Leave</option>
                <option value="Out of Station">Out of Station</option>
                <option value="Late Arrival">Late Arrival</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Employee Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Attendance Status</th>
                <th className="py-3.5 px-4">Check-In Time</th>
                <th className="py-3.5 px-4">Check-Out Time</th>
                <th className="py-3.5 px-4 text-right">Working Hours</th>
                <th className="py-3.5 px-4 text-center">Row Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CalendarCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No attendance records found for selected criteria.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Click "Mark Attendance" to record today's attendance.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const emp = employees.find((e) => e.id === rec.employeeId);
                  const empName = emp ? emp.name : rec.employeeId;
                  const dept = emp ? emp.department : 'N/A';

                  let statusBadgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (rec.status === 'Present') statusBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (rec.status === 'Absent') statusBadgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                  if (rec.status === 'Leave') statusBadgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (rec.status === 'Out of Station') statusBadgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
                  if (rec.status === 'Late Arrival') statusBadgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (rec.status === 'Half Day') statusBadgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {rec.employeeId}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {empName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {dept}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeStyle}`}>
                          {rec.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {rec.checkInTime}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {rec.checkOutTime}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {rec.workingHours} hrs
                      </td>

                      {/* Row Actions: Edit Attendance, View Attendance */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {/* ✏ Edit Attendance */}
                          <button
                            id={`btn-edit-attendance-${rec.employeeId}`}
                            onClick={() => openEditAttendanceModal(rec)}
                            title="Edit Attendance"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* 👁 View Attendance */}
                          <button
                            id={`btn-view-attendance-${rec.employeeId}`}
                            onClick={() => openViewAttendanceModal(rec.employeeId)}
                            title="View Employee Attendance Profile & Calendar"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Date: <strong>{selectedDate}</strong></span>
          <span>Records Displayed: <strong>{filteredRecords.length}</strong></span>
        </div>
      </div>

      {/* Mark Attendance Batch Modal */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        employees={employees}
        attendanceRecords={attendanceRecords}
        selectedDate={selectedDate}
        onSaveAttendance={(recs, targetDate) => {
          onSaveAttendance(recs, targetDate);
          onShowToast(`Attendance saved for ${targetDate}`);
        }}
      />

      {/* Individual Employee Attendance Profile View Modal */}
      <AttendanceViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={viewingEmployee}
        attendanceRecords={attendanceRecords}
      />

      {/* Single Edit Attendance Modal */}
      {isEditRecordModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">✏ Edit Attendance Record</h3>
              <button type="button" onClick={() => setIsEditRecordModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSingleEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee ID & Date</label>
                <input
                  type="text"
                  disabled
                  value={`${editingRecord.employeeId} (${editingRecord.date})`}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attendance Status</label>
                <select
                  value={editingRecord.status}
                  onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value as AttendanceStatus })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Out of Station">Out of Station</option>
                  <option value="Late Arrival">Late Arrival</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check-in Time</label>
                  <input
                    type="text"
                    value={editingRecord.checkInTime}
                    onChange={(e) => setEditingRecord({ ...editingRecord, checkInTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check-out Time</label>
                  <input
                    type="text"
                    value={editingRecord.checkOutTime}
                    onChange={(e) => setEditingRecord({ ...editingRecord, checkOutTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Working Hours</label>
                <input
                  type="number"
                  step="0.25"
                  value={editingRecord.workingHours}
                  onChange={(e) => setEditingRecord({ ...editingRecord, workingHours: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={editingRecord.remarks || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditRecordModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
