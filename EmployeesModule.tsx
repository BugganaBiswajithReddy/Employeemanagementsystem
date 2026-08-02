import React, { useState } from 'react';
import { Employee, EmploymentStatus } from '../types';
import {
  UserPlus,
  Trash2,
  Search,
  Filter,
  Eye,
  Edit,
  Building2,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
} from 'lucide-react';
import { EmployeeFormModal } from './EmployeeFormModal';
import { EmployeeViewModal } from './EmployeeViewModal';
import { ConfirmModal } from './ConfirmModal';

interface EmployeesModuleProps {
  employees: Employee[];
  attendanceRecords: any[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
  onDeleteMultipleEmployees: (empIds: string[]) => void;
}

export const EmployeesModule: React.FC<EmployeesModuleProps> = ({
  employees,
  attendanceRecords,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onDeleteMultipleEmployees,
}) => {
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteSingleModalOpen, setIsDeleteSingleModalOpen] = useState(false);

  const [isEditSelectModalOpen, setIsEditSelectModalOpen] = useState(false);
  const [editSelectId, setEditSelectId] = useState('');

  const [isDeleteSelectModalOpen, setIsDeleteSelectModalOpen] = useState(false);
  const [deleteSelectId, setDeleteSelectId] = useState('');

  // Departments List for Filter
  const departments = ['All', 'Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Operations'];

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase().trim();
    const name = emp?.name || '';
    const id = emp?.id || '';
    const dept = emp?.department || '';
    const desig = emp?.designation || '';

    const matchesSearch =
      !term ||
      name.toLowerCase().includes(term) ||
      id.toLowerCase().includes(term) ||
      dept.toLowerCase().includes(term) ||
      desig.toLowerCase().includes(term);

    const matchesDept = selectedDeptFilter === 'All' || emp.department === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'All' || emp.status === selectedStatusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  }).sort((a, b) => {
    const numA = parseInt((a?.id || '').replace(/\D/g, ''), 10) || 0;
    const numB = parseInt((b?.id || '').replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormModalOpen(true);
  };

  const openViewModal = (emp: Employee) => {
    setViewingEmployee(emp);
    setIsViewModalOpen(true);
  };

  const openSingleDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteSingleModalOpen(true);
  };

  const handleConfirmSingleDelete = () => {
    if (deleteTargetId) {
      onDeleteEmployee(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Top Button: ➕ Add Employee */}
            <button type="button"
              id="btn-add-employee-top"
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
            >
              <UserPlus className="w-4 h-4" />
              <span>➕ Add Employee</span>
            </button>

            {/* Top Button: ✏ Edit Employee */}
            <button type="button"
              id="btn-edit-employee-top"
              onClick={() => {
                setIsEditSelectModalOpen(true);
                setEditSelectId('');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <Edit className="w-4 h-4" />
              <span>✏ Edit Employee</span>
            </button>

            {/* Top Button: 🗑 Delete Employee */}
            <button type="button"
              id="btn-delete-employee-top"
              onClick={() => {
                setIsDeleteSelectModalOpen(true);
                setDeleteSelectId('');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>🗑 Delete Employee</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* 🔍 Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="input-search-employee"
                type="text"
                placeholder="Search Name, ID, Dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* ⚙ Filter Controls */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="flex items-center space-x-1.5 px-2.5 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">Filter:</span>
              </div>

              {/* Filter Department */}
              <select
                id="select-filter-dept"
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

              {/* Filter Status */}
              <select
                id="select-filter-status"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search / Filter Active Indicator */}
        {(searchTerm || selectedDeptFilter !== 'All' || selectedStatusFilter !== 'All') && (
          <div className="flex items-center justify-between text-xs bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-100 text-blue-800">
            <span>
              Showing <strong>{filteredEmployees.length}</strong> of {employees.length} employees
            </span>
            <button type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedDeptFilter('All');
                setSelectedStatusFilter('All');
              }}
              className="font-semibold underline hover:text-blue-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Employee Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Basic Salary</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No employees found matching criteria.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting filters or adding a new employee.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  return (
                    <tr
                      key={emp.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {emp.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-400">{emp.email}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{emp.department}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {emp.designation}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {emp.status === 'Active' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{emp.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900 font-mono">
                        ${(emp.basicSalary || 0).toLocaleString()}
                      </td>

                      {/* Row Actions: View, Edit, Delete */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {/* 👁 View */}
                          <button type="button"
                            id={`btn-view-${emp.id}`}
                            onClick={() => openViewModal(emp)}
                            title="View Employee Profile"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* ✏ Edit */}
                          <button type="button"
                            id={`btn-edit-${emp.id}`}
                            onClick={() => openEditModal(emp)}
                            title="Edit Employee"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* 🗑 Delete */}
                          <button type="button"
                            id={`btn-delete-${emp.id}`}
                            onClick={() => openSingleDeleteModal(emp.id)}
                            title="Delete Employee"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
          <span>
            Total Employees Registered: <strong className="text-slate-800">{employees.length}</strong>
          </span>
          <span>Showing {filteredEmployees.length} rows</span>
        </div>
      </div>

      {/* Employee Add / Edit Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={(emp) => {
          if (editingEmployee) {
            onUpdateEmployee(emp);
          } else {
            onAddEmployee(emp);
          }
        }}
        initialData={editingEmployee}
        existingEmployees={employees}
      />

      {/* Employee Profile View Modal */}
      <EmployeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={viewingEmployee}
        attendanceRecords={attendanceRecords}
      />

      {/* Single Employee Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteSingleModalOpen}
        onClose={() => setIsDeleteSingleModalOpen(false)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Employee Record?"
        message="Are you sure you want to delete this employee? This action will remove their record from the active employee directory."
        confirmText="Delete Employee"
      />

      {/* Select Employee to Delete Modal */}
      {isDeleteSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Select Employee to Delete</h3>
              <button type="button" onClick={() => setIsDeleteSelectModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
              <select
                value={deleteSelectId}
                onChange={(e) => setDeleteSelectId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="">-- Choose an Employee --</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
              <button type="button"
                onClick={() => setIsDeleteSelectModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button type="button"
                onClick={() => {
                  const emp = employees.find(e => e.id === deleteSelectId);
                  if (emp) {
                    setIsDeleteSelectModalOpen(false);
                    openSingleDeleteModal(emp.id);
                  }
                }}
                disabled={!deleteSelectId}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Employee to Edit Modal */}
      {isEditSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Select Employee to Edit</h3>
              <button type="button" onClick={() => setIsEditSelectModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
              <select
                value={editSelectId}
                onChange={(e) => setEditSelectId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Choose an Employee --</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
              <button type="button"
                onClick={() => setIsEditSelectModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button type="button"
                onClick={() => {
                  const emp = employees.find(e => e.id === editSelectId);
                  if (emp) {
                    setIsEditSelectModalOpen(false);
                    openEditModal(emp);
                  }
                }}
                disabled={!editSelectId}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Details</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
