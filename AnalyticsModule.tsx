import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, Payslip } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Filter } from 'lucide-react';

interface AnalyticsModuleProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  payslips: Payslip[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ employees, attendanceRecords, payslips }) => {
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [activeView, setActiveView] = useState<'overview' | 'salary' | 'attendance'>('overview');
  const [attendanceStartDate, setAttendanceStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [attendanceEndDate, setAttendanceEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredEmployees = useMemo(() => {
    if (filterDepartment === 'All') return employees;
    return employees.filter(e => e.department === filterDepartment);
  }, [employees, filterDepartment]);

  // Chart Data: Emp count by dept
  const empByDeptData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEmployees.forEach(e => {
      counts[e.department] = (counts[e.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredEmployees]);

  // Chart Data: Avg Salary by Dept
  const avgSalaryByDeptData = useMemo(() => {
    const data: Record<string, { total: number, count: number }> = {};
    filteredEmployees.forEach(e => {
      if (!data[e.department]) data[e.department] = { total: 0, count: 0 };
      data[e.department].total += e.basicSalary || 0;
      data[e.department].count += 1;
    });
    return Object.entries(data).map(([name, { total, count }]) => ({
      name,
      average: count > 0 ? Math.round(total / count) : 0
    }));
  }, [filteredEmployees]);

    // Chart Data: Attendance Trend
  const attendanceTrendData = useMemo(() => {
    const validEmployeeIds = new Set(filteredEmployees.map(e => e.id));
    const filteredAttendance = attendanceRecords.filter(
      a => validEmployeeIds.has(a.employeeId) && a.date >= attendanceStartDate && a.date <= attendanceEndDate
    );
    
    const days: Record<string, Record<string, any>> = {};
    let currDate = new Date(attendanceStartDate);
    const endDate = new Date(attendanceEndDate);
    
    let count = 0;
    while (currDate <= endDate && count < 366) {
      const dateStr = currDate.toISOString().split('T')[0];
      days[dateStr] = {
        date: dateStr,
        Present: 0,
        Absent: 0,
        Leave: 0,
        'Out of Station': 0,
        'Half Day': 0,
        'Late Arrival': 0
      };
      currDate.setDate(currDate.getDate() + 1);
      count++;
    }

    filteredAttendance.forEach(a => {
      if (days[a.date]) {
        days[a.date][a.status] = (days[a.date][a.status] || 0) + 1;
      }
    });

    return Object.values(days);
  }, [attendanceRecords, filteredEmployees, attendanceStartDate, attendanceEndDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Workforce and payroll insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button type="button" onClick={() => setActiveView('overview')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Overview</button>
          <button type="button" onClick={() => setActiveView('salary')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'salary' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Salary Trends</button>
          <button type="button" onClick={() => setActiveView('attendance')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'attendance' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Attendance</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex gap-4 items-center">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <span className="text-sm text-slate-500 ml-4">Showing data for: <strong>{filteredEmployees.length}</strong> employees</span>
      </div>

      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">Employee Count by Department</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={empByDeptData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {empByDeptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">Average Salary by Department</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgSalaryByDeptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'salary' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">Salary Distribution (All Employees)</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredEmployees.map(e => ({ name: e.name, salary: e.basicSalary }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="salary" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'attendance' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-base font-bold text-slate-800">Attendance Trend</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={attendanceStartDate}
                  onChange={(e) => setAttendanceStartDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={attendanceEndDate}
                  onChange={(e) => setAttendanceEndDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Legend />
                  <Bar dataKey="Present" fill="#10b981" />
                  <Bar dataKey="Late Arrival" fill="#f59e0b" />
                  <Bar dataKey="Half Day" fill="#facc15" />
                  <Bar dataKey="Out of Station" fill="#3b82f6" />
                  <Bar dataKey="Leave" fill="#8b5cf6" />
                  <Bar dataKey="Absent" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
