import React, { useState, useEffect } from 'react';
import { Employee, EmploymentStatus } from '../types';
import { X, Save, RotateCcw, User, Briefcase, CreditCard, DollarSign } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  initialData?: Employee | null;
  existingEmployees: Employee[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingEmployees,
}) => {
  const isEditing = !!initialData;

  const generateNewId = () => {
    const ids = existingEmployees
      .map((e) => parseInt(e.id.replace('EMP', ''), 10))
      .filter((n) => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const nextId = (maxId + 1).toString().padStart(3, '0');
    return `EMP${nextId}`;
  };

  const getInitialState = (): Employee => {
    if (initialData) {
      return {
        ...initialData,
        bankDetails: {
          bankName: initialData.bankDetails?.bankName || '',
          accountNumber: initialData.bankDetails?.accountNumber || '',
          ifscCode: initialData.bankDetails?.ifscCode || '',
        },
      };
    }
    return {
      id: generateNewId(),
      name: '',
      email: '',
      mobile: '',
      department: 'Engineering',
      designation: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: 'Active' as EmploymentStatus,
      bankDetails: {
        bankName: '',
        accountNumber: '',
        ifscCode: '',
      },
      basicSalary: 60000,
      dearnessAllowance: 0,
      houseRentAllowance: 0,
      medicalAllowance: 0,
      otherAllowances: 0,
      insuranceContribution: 0,
      otherDeductions: 0,
      leaveBalance: 12,
    };
  };

  const [formData, setFormData] = useState<Employee>(getInitialState);
  const [activeFormTab, setActiveFormTab] = useState<'personal' | 'employment' | 'bank' | 'salary'>('personal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState());
      setActiveFormTab('personal');
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Employee name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.dateOfJoining) errs.dateOfJoining = 'Date of joining is required';
    if (!formData.bankDetails.bankName.trim()) errs.bankName = 'Bank name is required';
    if (!formData.bankDetails.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (!formData.bankDetails.ifscCode.trim()) errs.ifscCode = 'IFSC / Swift code is required';
    if (formData.basicSalary <= 0 || isNaN(formData.basicSalary)) errs.basicSalary = 'Basic salary must be > 0';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const handleReset = () => {
    setFormData(getInitialState());
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>{isEditing ? '✏ Edit Employee Information' : '➕ Register New Employee'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing ? `Updating employee record for ID: ${formData.id}` : 'Fill in personal, employment, bank, and salary details.'}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2">
          {[
            { id: 'personal', label: '1. Personal Info', icon: User },
            { id: 'employment', label: '2. Employment', icon: Briefcase },
            { id: 'bank', label: '3. Bank Details', icon: CreditCard },
            { id: 'salary', label: '4. Salary', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFormTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2.5 px-3 text-xs font-semibold rounded-t-lg border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-600 bg-white text-blue-600 shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Personal Information */}
          {activeFormTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID <span className="text-slate-400">(Auto-generated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-100 font-mono text-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.mobile && <p className="text-[10px] text-rose-500 mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. j.doe@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Employment Information */}
          {activeFormTab === 'employment' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.designation ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.designation && <p className="text-[10px] text-rose-500 mt-1">{errors.designation}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Joining <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Leave Balance
                  </label>
                  <input
                    type="number"
                    value={formData.leaveBalance || 0}
                    onChange={(e) => setFormData({ ...formData, leaveBalance: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bank Information */}
          {activeFormTab === 'bank' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JPMorgan Chase"
                    value={formData.bankDetails.bankName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bankName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.bankName && <p className="text-[10px] text-rose-500 mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 987654321012"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.accountNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.accountNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.accountNumber}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IFSC / Routing / Swift Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CHAS000182"
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, ifscCode: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-xs rounded-lg border text-slate-900 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ifscCode ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.ifscCode && <p className="text-[10px] text-rose-500 mt-1">{errors.ifscCode}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Salary Information */}
          {activeFormTab === 'salary' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Basic Salary <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) || 0 })}
                      className={`w-full pl-7 pr-3 py-2 text-xs rounded-lg border text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.basicSalary ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'}`}
                    />
                  </div>
                  {errors.basicSalary && <p className="text-[10px] text-rose-500 mt-1">{errors.basicSalary}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dearness Allowance (DA)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.dearnessAllowance}
                      onChange={(e) => setFormData({ ...formData, dearnessAllowance: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">House Rent Allowance (HRA)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.houseRentAllowance}
                      onChange={(e) => setFormData({ ...formData, houseRentAllowance: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Allowance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.medicalAllowance}
                      onChange={(e) => setFormData({ ...formData, medicalAllowance: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Other Allowances</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.otherAllowances}
                      onChange={(e) => setFormData({ ...formData, otherAllowances: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Contribution</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.insuranceContribution}
                      onChange={(e) => setFormData({ ...formData, insuranceContribution: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Other Deductions</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.otherDeductions}
                      onChange={(e) => setFormData({ ...formData, otherDeductions: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Quick Step Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              {activeFormTab !== 'personal' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeFormTab === 'employment') setActiveFormTab('personal');
                    if (activeFormTab === 'bank') setActiveFormTab('employment');
                    if (activeFormTab === 'salary') setActiveFormTab('bank');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 font-medium hover:bg-slate-50"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              {activeFormTab !== 'salary' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeFormTab === 'personal') setActiveFormTab('employment');
                    if (activeFormTab === 'employment') setActiveFormTab('bank');
                    if (activeFormTab === 'bank') setActiveFormTab('salary');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Next Step →
                </button>
              )}
            </div>
          </div>

          {/* Footer Form Action Buttons: Save, Reset, Cancel */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="btn-save-employee"
                className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Employee</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
