import React from 'react';
import { Employee, AttendanceRecord, ActivityLog, Project } from '../types';
import {
  Users,
  CheckCircle2,
  CalendarOff,
  MapPin,
  XCircle,
  UserPlus,
  ClipboardCheck,
  Clock,
  TrendingUp,
  Activity,
  UserCheck,
  Briefcase,
} from 'lucide-react';

interface DashboardModuleProps {
  projects: Project[];
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  activityLogs: ActivityLog[];
  onNavigateToAddEmployee: () => void;
  onNavigateToMarkAttendance: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  employees,
  attendanceRecords,
  activityLogs,
  onNavigateToAddEmployee,
  onNavigateToMarkAttendance,
  projects,
}) => {
  const activeEmployees = employees.filter((emp) => emp.status === 'Active');
  const totalEmployeesCount = activeEmployees.length;

  // Compute status breakdown from attendanceRecords
  const presentCount = attendanceRecords.filter(
    (r) => r.status === 'Present' || r.status === 'Late Arrival' || r.status === 'Half Day'
  ).length;

  const onLeaveCount = attendanceRecords.filter((r) => r.status === 'Leave').length;

  const outOfStationCount = attendanceRecords.filter((r) => r.status === 'Out of Station').length;

  const absentCount = attendanceRecords.filter((r) => r.status === 'Absent').length;

  // Department distribution
  const deptCounts: Record<string, number> = {};
  activeEmployees.forEach((emp) => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });


  const totalProjects = projects.length;
  const notStartedProjects = projects.filter(p => p.status === 'Not Started').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  const projectCards = [
    {
      id: 'proj-total',
      title: 'Total Projects',
      value: totalProjects.toString(),
      subtitle: 'All existing projects',
      icon: Briefcase,
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      iconBg: 'bg-slate-600 text-white',
    },
    {
      id: 'proj-not-started',
      title: 'Not Started',
      value: `${notStartedProjects} / ${totalProjects}`,
      subtitle: 'Awaiting kick-off',
      icon: Clock,
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      iconBg: 'bg-slate-600 text-white',
    },
    {
      id: 'proj-in-progress',
      title: 'In Progress',
      value: `${inProgressProjects} / ${totalProjects}`,
      subtitle: 'Currently active',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'proj-on-hold',
      title: 'On Hold',
      value: `${onHoldProjects} / ${totalProjects}`,
      subtitle: 'Pending blockers',
      icon: MapPin, // or any other suitable icon available
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      id: 'proj-completed',
      title: 'Completed',
      value: `${completedProjects} / ${totalProjects}`,
      subtitle: 'Successfully finished',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
    },
  ];

  const cards = [
    {
      id: 'card-total-employees',
      title: 'Total Employees',
      value: totalEmployeesCount,
      subtitle: `${employees.length - totalEmployeesCount} Inactive`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'card-present-today',
      title: 'Present Today',
      value: presentCount,
      subtitle: `${totalEmployeesCount > 0 ? Math.round((presentCount / totalEmployeesCount) * 100) : 0}% Turnout`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'card-on-leave',
      title: 'On Leave',
      value: onLeaveCount,
      subtitle: 'Approved Time-off',
      icon: CalendarOff,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      id: 'card-out-of-station',
      title: 'Out of Station',
      value: outOfStationCount,
      subtitle: 'Off-site Duty / Client',
      icon: MapPin,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      iconBg: 'bg-purple-600 text-white',
    },
    {
      id: 'card-absent-today',
      title: 'Absent Today',
      value: absentCount,
      subtitle: 'Unexcused / Pending',
      icon: XCircle,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      iconBg: 'bg-rose-600 text-white',
    },
  ];

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'EMPLOYEE_ADDED':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'EMPLOYEE_UPDATED':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'EMPLOYEE_DELETED':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'ATTENDANCE_MARKED':
        return <ClipboardCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Dashboard Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Workforce Metrics Today</span>
          </h2>
          <span className="text-xs text-slate-500">Live Snapshot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className={`p-4 rounded-xl border bg-white shadow-2xs transition-all hover:shadow-md flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {card.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* 1.5. Project Overview Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Project Overview</span>
          </h2>
          <span className="text-xs text-slate-500">Live Snapshot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {projectCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className={`p-4 rounded-xl border bg-white shadow-2xs transition-all hover:shadow-md flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {card.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Quick Actions Section */}
      <section className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold tracking-wide border border-blue-400/30">
              Quick Management Shortcuts
            </span>
            <h2 className="text-lg font-bold text-white">Administrator Quick Actions</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Register new hires or complete today's workforce attendance logging in one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Quick Action: Add Employee */}
            <button type="button"
              id="btn-quick-add-employee"
              onClick={onNavigateToAddEmployee}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>➕ Add Employee</span>
            </button>

            {/* Quick Action: Mark Attendance */}
            <button type="button"
              id="btn-quick-mark-attendance"
              onClick={onNavigateToMarkAttendance}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>📝 Mark Attendance</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Recent Activity & Department Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Recent Activity Log</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Real-time System Audit</span>
          </div>

          <div className="mt-4 space-y-3">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No system activity logged yet.</p>
            ) : (
              activityLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100/80 transition-colors hover:bg-slate-100/50"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {getActivityIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {log.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                        {log.timestamp}
                      </span>
                    </div>
                    {log.employeeName && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Target: <span className="font-medium text-slate-700">{log.employeeName}</span> ({log.employeeId})
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Department Workforce Breakdown */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Department Distribution</h3>
            </div>

            <div className="mt-4 space-y-3">
              {Object.entries(deptCounts).map(([dept, count]) => {
                const percentage = totalEmployeesCount > 0 ? Math.round((count / totalEmployeesCount) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{dept}</span>
                      <span className="text-slate-500">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <div className="font-semibold">Need to add staff?</div>
                <div className="text-[11px] text-blue-700">Add info & bank details directly.</div>
              </div>
              <button type="button"
                onClick={onNavigateToAddEmployee}
                className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[11px] font-semibold hover:bg-blue-700 shrink-0"
              >
                + Add
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
