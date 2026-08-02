import React, { useState } from 'react';
import { Employee, Payslip, AttendanceRecord } from '../types';
import { calculateSalary } from '../utils/salaryCalculator';
import { Banknote, FileText, Download, Printer, Search, Filter, Plus, Eye, Edit2 } from 'lucide-react';

interface PayslipsModuleProps {
  employees: Employee[];
  payslips: Payslip[];
  attendanceRecords: AttendanceRecord[];
  onGeneratePayslip: (payslip: Payslip) => void;
  onGenerateMultiplePayslips: (payslips: Payslip[]) => void;
  onUpdatePayslip: (payslip: Payslip) => void;
  onDeletePayslip: (id: string) => void;
}

export const PayslipsModule: React.FC<PayslipsModuleProps> = ({ employees, payslips, attendanceRecords, onGeneratePayslip, onGenerateMultiplePayslips, onUpdatePayslip, onDeletePayslip }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);
  const [deletingPayslipId, setDeletingPayslipId] = useState<string | null>(null);
  const [editingStatusPayslip, setEditingStatusPayslip] = useState<Payslip | null>(null);

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  const filteredPayslips = payslips.filter((p) => {
    const emp = employees.find((e) => e.id === p.employeeId);
    if (!emp) return false;

    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.month?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth = filterMonth ? p.month === filterMonth : true;
    const matchesDept = filterDepartment === 'All' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || p.paymentStatus === filterStatus;

    return matchesSearch && matchesMonth && matchesDept && matchesStatus;
  });

  const handlePrint = (payslip: Payslip) => {
    // Basic print trigger for demonstration
    setViewingPayslip(payslip);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = (payslip: Payslip) => {
    // Fake download
    const element = document.createElement("a");
    const file = new Blob([`Payslip Details:\nEmployee ID: ${payslip.employeeId}\nMonth: ${payslip.month}\nNet Salary: $${payslip.netSalary}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `payslip_${payslip.employeeId}_${payslip.month}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Payslips</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and generate employee salary slips.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button"
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
          >
            <Banknote className="w-4 h-4" />
            <span>Generate Payslip</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pay Period</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Net Salary</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayslips.length > 0 ? (
                filteredPayslips.map((payslip) => {
                  const emp = employees.find((e) => e.id === payslip.employeeId);
                  return (
                    <tr key={payslip.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{emp?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp?.department || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{payslip.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">${payslip.netSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          payslip.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                          payslip.paymentStatus === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {payslip.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button type="button" onClick={() => setEditingStatusPayslip(payslip)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Change Status">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => setViewingPayslip(payslip)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleDownload(payslip)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handlePrint(payslip)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Print">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => setDeletingPayslipId(payslip.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Banknote className="w-8 h-8 text-slate-300" />
                      <p>No payslips found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* View Payslip Modal (For print and view) */}
      {viewingPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:bg-white print:p-0">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none">
            {(() => {
              const emp = employees.find((e) => e.id === viewingPayslip.employeeId);
              return (
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start print:hidden">
                    <h3 className="text-xl font-bold text-slate-800">Payslip Details</h3>
                    <button type="button" onClick={() => setViewingPayslip(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                  
                  <div className="border border-slate-200 p-6 rounded-xl space-y-6 print:border-none print:p-0">
                    <div className="flex justify-between border-b pb-4">
                      <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workforce HR</h1>
                        <p className="text-sm text-slate-500">Payslip for the month of {viewingPayslip.month}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">Status: {viewingPayslip.paymentStatus}</p>
                        {viewingPayslip.paymentDate && <p className="text-xs text-slate-500">Paid on: {viewingPayslip.paymentDate}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Employee Details</p>
                        <p className="font-semibold text-slate-900">{emp?.name}</p>
                        <p className="text-slate-600">ID: {viewingPayslip.employeeId}</p>
                        <p className="text-slate-600">{emp?.designation} • {emp?.department}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Bank Details</p>
                        <p className="text-slate-600">{emp?.bankDetails?.bankName || 'N/A'}</p>
                        <p className="text-slate-600">Acc: {emp?.bankDetails?.accountNumber || 'N/A'}</p>
                        <p className="text-slate-600">IFSC: {emp?.bankDetails?.ifscCode || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Payroll Period</p>
                        <p className="text-slate-600">Period: {viewingPayslip.startDate || 'N/A'} to {viewingPayslip.endDate || 'N/A'}</p>
                        <p className="text-slate-600">Payable Days: {viewingPayslip.payableDays || 0} / {viewingPayslip.totalDays || 0}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="font-semibold text-slate-900 border-b pb-2">Earnings</p>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Basic Salary</span><span className="font-medium">${viewingPayslip.basicSalary.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Dearness Allowance</span><span className="font-medium">${viewingPayslip.dearnessAllowance.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">House Rent Allowance</span><span className="font-medium">${viewingPayslip.houseRentAllowance.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Medical Allowance</span><span className="font-medium">${viewingPayslip.medicalAllowance.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Other Allowances</span><span className="font-medium">${viewingPayslip.otherAllowances.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm font-bold pt-2 border-t text-slate-900"><span>Total Earnings</span><span>${viewingPayslip.totalEarnings.toLocaleString()}</span></div>
                      </div>
                      <div className="space-y-3">
                        <p className="font-semibold text-slate-900 border-b pb-2">Deductions</p>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Insurance Contribution</span><span className="font-medium">${viewingPayslip.insuranceContribution.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Other Deductions</span><span className="font-medium">${viewingPayslip.otherDeductions.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm font-bold pt-2 border-t text-slate-900"><span>Total Deductions</span><span>${viewingPayslip.totalDeductions.toLocaleString()}</span></div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-sm">Net Pay</span>
                      <span className="text-2xl font-black text-slate-900">${viewingPayslip.netSalary.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 print:hidden">
                    <button type="button" onClick={() => setViewingPayslip(null)} className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm">Close</button>
                    <button type="button" onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium text-sm flex items-center space-x-2">
                      <Printer className="w-4 h-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Generate Payslip Modal */}
      {isGenerateModalOpen && (
        <GeneratePayslipModal
          employees={employees}
          payslips={payslips}
          attendanceRecords={attendanceRecords}
          onClose={() => setIsGenerateModalOpen(false)}
          onGenerate={onGeneratePayslip}
          onGenerateMultiple={onGenerateMultiplePayslips}
        />
      )}

      
      {/* Edit Status Modal */}
      {editingStatusPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Update Payment Status</h3>
            <div className="space-y-3">
              {(['Pending', 'Processing', 'Paid'] as const).map(status => (
                <button type="button"
                  key={status}
                  onClick={() => {
                    const updated = { ...editingStatusPayslip, paymentStatus: status };
                    if (status === 'Paid' && updated.paymentStatus !== 'Paid') {
                      updated.paymentDate = new Date().toISOString().split('T')[0];
                    }
                    onUpdatePayslip(updated);
                    setEditingStatusPayslip(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border ${editingStatusPayslip.paymentStatus === status ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <div className="font-medium text-sm">{status}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button"
                onClick={() => setEditingStatusPayslip(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{/* Delete Confirmation Modal */}
      {deletingPayslipId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Payslip?</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete this payslip? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button type="button"
                onClick={() => setDeletingPayslipId(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button type="button"
                onClick={() => {
                  onDeletePayslip(deletingPayslipId);
                  setDeletingPayslipId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const GeneratePayslipModal: React.FC<{ 
  employees: Employee[], 
  payslips: Payslip[],
  attendanceRecords: AttendanceRecord[],
  onClose: () => void, 
  onGenerate: (p: Payslip) => void,
  onGenerateMultiple: (ps: Payslip[]) => void
}> = ({ employees, payslips, attendanceRecords, onClose, onGenerate, onGenerateMultiple }) => {
  const [empId, setEmpId] = useState('');
  
  // Set default dates to the current month's start and end
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);

  const handleGenerate = () => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const monthStr = startDate.slice(0, 7);
    const exists = payslips.some(p => p.employeeId === emp.id && p.month === monthStr);
    if (exists) {
      alert(`Payslip for ${emp.name} already exists for ${monthStr}`);
      return;
    }
    const calc = calculateSalary(emp, attendanceRecords, startDate, endDate);
    if (calc) {
      const p: Payslip = {
        ...calc,
        id: `PS-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      };
      onGenerate(p);
    }
    onClose();
  };

  const handleGenerateAll = () => {
    const newPayslips: Payslip[] = [];
    const monthStr = startDate.slice(0, 7);
    let skipped = 0;
    employees.forEach(emp => {
      if (emp.status === 'Active') {
        const exists = payslips.some(p => p.employeeId === emp.id && p.month === monthStr);
        if (!exists) {
          const calc = calculateSalary(emp, attendanceRecords, startDate, endDate);
          if (calc) {
            newPayslips.push({
              ...calc,
              id: `PS-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
            });
          }
        } else {
          skipped++;
        }
      }
    });
    if (newPayslips.length > 0) {
      onGenerateMultiple(newPayslips);
    } else if (skipped > 0) {
      alert(`All active employees already have a payslip for ${monthStr}.`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Generate Payslip</h3>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
            <select value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option value="">-- Select Employee --</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50 rounded-b-2xl gap-3">
          <button type="button" onClick={handleGenerateAll} disabled={!startDate || !endDate} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Generate for All
          </button>
          <div className="flex w-full sm:w-auto space-x-3">
            <button type="button" onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <button type="button" onClick={handleGenerate} disabled={!empId || !startDate || !endDate} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Generate</button>
          </div>
        </div>
      </div>
    </div>
  );
};
