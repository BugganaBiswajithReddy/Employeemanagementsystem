import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Employee, AttendanceRecord, Payslip, Project } from '../types';
import { SettingsModal } from './SettingsModal';
import { User, Calendar, LogOut, CheckCircle2, Clock, MapPin, XCircle, LayoutDashboard, CalendarCheck, Banknote, ShieldCheck, X, Menu, KeyRound, Download, Edit, Phone, Mail, Building2, Briefcase } from 'lucide-react';

interface Props {
  employee: Employee;
  attendance: AttendanceRecord[];
  payslips: Payslip[];
  projects: Project[];
  onLogout: () => void;
  onUpdateEmployee: (emp: Employee) => void;
}

type Tab = 'dashboard' | 'attendance' | 'payslips' | 'projects';

export const EmployeeDashboardView: React.FC<Props> = ({ employee, attendance, payslips, projects, onLogout, onUpdateEmployee }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState<'profile' | 'security' | null>(null);

  // Stats
  const myAttendance = useMemo(() => {
    const records = attendance.filter(a => a.employeeId === employee.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const seen = new Set<string>();
    return records.filter(r => {
      if (seen.has(r.date)) return false;
      seen.add(r.date);
      return true;
    });
  }, [attendance, employee.id]);

  const myPayslips = useMemo(() => {
    return payslips.filter(p => p.employeeId === employee.id).sort((a, b) => b.month.localeCompare(a.month));
  }, [payslips, employee.id]);

  const presentDays = myAttendance.filter(a => ['Present', 'Late Arrival', 'Half Day'].includes(a.status)).length;
  const leaveBalance = employee.leaveBalance ?? 12;

  const profileRef = useRef<HTMLDivElement>(null);

  const handleDownload = (payslip: Payslip) => {
    const element = document.createElement("a");
    const file = new Blob([`Payslip Details:\nEmployee ID: ${payslip.employeeId}\nMonth: ${payslip.month}\nNet Salary: ${payslip.netSalary}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `payslip_${payslip.employeeId}_${payslip.month}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menu items for sidebar
  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance' as Tab, label: 'My Attendance', icon: CalendarCheck },
    { id: 'payslips' as Tab, label: 'My Payslips', icon: Banknote },
    { id: 'projects' as Tab, label: 'My Projects', icon: Briefcase },
  ];

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">Workforce HR</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Employee Portal</p>
          </div>
        </div>
        {isMobileOpen && (
          <button type="button" onClick={() => setIsMobileOpen(false)} className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Main Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button type="button"
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
      <div className="p-2 border-t border-slate-800/80"></div>
    </>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome back, {employee.name.split(' ')[0]}!</h1>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Employee ID</p>
            <p className="text-xl font-bold text-slate-800">{employee.id}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Present Days</p>
            <p className="text-xl font-bold text-slate-800">{presentDays}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Leave Balance</p>
            <p className="text-xl font-bold text-slate-800">{leaveBalance}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Date of Joining</p>
            <p className="text-xl font-bold text-slate-800">{new Date(employee.dateOfJoining).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg">Recent Attendance</h2>
            <button type="button" onClick={() => setActiveTab('attendance')} className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
              View All <Menu className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto">
            {myAttendance.length > 0 ? (
              <div className="space-y-3">
                {myAttendance.slice(0, 5).map(record => {
                  const statusColors: any = {
                    'Present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    'Absent': 'bg-red-100 text-red-700 border-red-200',
                    'Leave': 'bg-purple-100 text-purple-700 border-purple-200',
                    'Half Day': 'bg-amber-100 text-amber-700 border-amber-200',
                    'Late Arrival': 'bg-orange-100 text-orange-700 border-orange-200',
                    'Out of Station': 'bg-blue-100 text-blue-700 border-blue-200'
                  };
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <div>
                        <p className="font-semibold text-slate-800">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{record.checkInTime} - {record.checkOutTime} ({record.workingHours} hrs)</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${statusColors[record.status] || 'bg-slate-100 text-slate-700'}`}>
                        {record.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <CalendarCheck className="w-10 h-10 mb-2 opacity-50" />
                <p>No attendance records found.</p>
              </div>
            )}
          </div>
        </div>

        
        {/* Projects Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg">Active Projects</h2>
            <button type="button" onClick={() => setActiveTab('projects')} className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
              View All <Briefcase className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {myProjects.length > 0 ? (
              <div className="space-y-4">
                {myProjects.slice(0, 3).map(project => (
                  <div key={project.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-sm">{project.name}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      Due: {project.expectedEndDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Briefcase className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-700">No active projects</p>
                <p className="text-xs text-slate-500 mt-1">You have no projects assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* My Payslips Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg">Recent Payslips</h2>
            <button type="button" onClick={() => setActiveTab('payslips')} className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
              View All <Menu className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto">
            {myPayslips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPayslips.slice(0, 4).map(payslip => (
                  <div key={payslip.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-800">{payslip.month}</p>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Net: ₹{payslip.netSalary.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        payslip.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        payslip.paymentStatus === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {payslip.paymentStatus}
                      </div>
                      <button type="button" onClick={() => handleDownload(payslip)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                        <Download className="w-3 h-3 mr-1" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Banknote className="w-10 h-10 mb-2 opacity-50" />
                <p>No payslips available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Attendance</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Check-in</th>
                <th className="px-6 py-4">Check-out</th>
                <th className="px-6 py-4">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAttendance.length > 0 ? (
                myAttendance.map(record => {
                  const statusColors: any = {
                    'Present': 'bg-emerald-100 text-emerald-700',
                    'Absent': 'bg-red-100 text-red-700',
                    'Leave': 'bg-purple-100 text-purple-700',
                    'Half Day': 'bg-amber-100 text-amber-700',
                    'Late Arrival': 'bg-orange-100 text-orange-700',
                    'Out of Station': 'bg-blue-100 text-blue-700'
                  };
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[record.status] || 'bg-slate-100 text-slate-700'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{record.checkInTime || '-'}</td>
                      <td className="px-6 py-4">{record.checkOutTime || '-'}</td>
                      <td className="px-6 py-4 font-medium">{record.workingHours || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  const myProjects = projects.filter(p => p.assignedEmployees?.includes(employee.id) || false);

  const renderProjects = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Assigned Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myProjects.length > 0 ? (
          myProjects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">ID: {project.id}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  project.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-6 flex-1">{project.description || 'No description provided.'}</p>
              
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>{project.startDate}</span>
                </div>
                <span>to</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>{project.expectedEndDate}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Projects Assigned</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">You currently don't have any projects assigned to you. When you are assigned to a project, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayslips = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Payslips</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Net Salary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myPayslips.length > 0 ? (
                myPayslips.map(payslip => (
                  <tr key={payslip.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{payslip.month}</td>
                    <td className="px-6 py-4 font-medium">₹{payslip.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        payslip.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        payslip.paymentStatus === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {payslip.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button type="button" onClick={() => handleDownload(payslip)} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg text-xs transition-colors">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No payslips found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      {showSettings && <SettingsModal employee={employee} onClose={() => setShowSettings(null)} onUpdateEmployee={onUpdateEmployee} initialTab={showSettings} />}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 border-r border-slate-800 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <button type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' ? 'Employee Dashboard' :
                 activeTab === 'attendance' ? 'Attendance Tracking' : activeTab === 'projects' ? 'My Projects' : 'Payslips'}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Date Display */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            
            {/* Employee Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 focus:outline-none hover:bg-slate-50 p-1 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                  {employee.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900">{employee.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Employee</div>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">{employee.name}</p>
                    <p className="text-xs text-slate-500">{employee.email}</p>
                  </div>
                                    <button type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setShowSettings('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors mt-1"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setShowSettings('security');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors mt-1"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors font-medium mb-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'attendance' && renderAttendance()}
            {activeTab === 'payslips' && renderPayslips()}
            {activeTab === 'projects' && renderProjects()}
          </div>
        </main>
      </div>
    </div>
  );
};
