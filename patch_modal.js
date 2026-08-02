const fs = require('fs');
let content = fs.readFileSync('src/components/PayslipsModule.tsx', 'utf-8');

// The file might already have the new GeneratePayslipModal inside it. Let's find and replace it.
const modalStart = 'const GeneratePayslipModal: React.FC';
const modalEnd = '};';

let beforeModal = content.substring(0, content.indexOf(modalStart));

const newModalCode = `
const GeneratePayslipModal: React.FC<{ 
  employees: Employee[], 
  attendanceRecords: AttendanceRecord[],
  onClose: () => void, 
  onGenerate: (p: Payslip) => void,
  onGenerateMultiple: (ps: Payslip[]) => void
}> = ({ employees, attendanceRecords, onClose, onGenerate, onGenerateMultiple }) => {
  const [empId, setEmpId] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const calculatePayslipForEmployee = (emp: Employee): Payslip | null => {
    // Determine payable days
    const empAttendance = attendanceRecords.filter(a => a.employeeId === emp.id && a.date >= startDate && a.date <= endDate);
    let payableDays = 0;
    
    // If no attendance exists, maybe they get 0? Wait, let's just count days present/leave/out of station.
    empAttendance.forEach(a => {
      if (['Present', 'Late Arrival', 'Leave', 'Out of Station'].includes(a.status)) {
        payableDays += 1;
      } else if (a.status === 'Half Day') {
        payableDays += 0.5;
      }
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const ratio = payableDays / totalDays;

    const basic = (emp.basicSalary || 0) * ratio;
    const da = (emp.dearnessAllowance || 0) * ratio;
    const hra = (emp.houseRentAllowance || 0) * ratio;
    const medical = (emp.medicalAllowance || 0) * ratio;
    const other = (emp.otherAllowances || 0) * ratio;
    const totalEarnings = basic + da + hra + medical + other;
    
    const insurance = emp.insuranceContribution || 0;
    const otherDeductions = emp.otherDeductions || 0;
    const totalDeductions = insurance + otherDeductions;
    
    const net = totalEarnings - totalDeductions;
    const monthStr = startDate.slice(0, 7);

    return {
      id: \`PS-\${Date.now()}-\${Math.random().toString(36).substr(2, 5)}\`,
      employeeId: emp.id,
      month: monthStr,
      startDate,
      endDate,
      payableDays,
      totalDays,
      basicSalary: basic,
      dearnessAllowance: da,
      houseRentAllowance: hra,
      medicalAllowance: medical,
      otherAllowances: other,
      insuranceContribution: insurance,
      otherDeductions: otherDeductions,
      totalDeductions: totalDeductions,
      totalEarnings: totalEarnings,
      netSalary: net,
      paymentStatus: 'Pending'
    };
  };

  const handleGenerate = () => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const p = calculatePayslipForEmployee(emp);
    if (p) onGenerate(p);
    onClose();
  };

  const handleGenerateAll = () => {
    const newPayslips: Payslip[] = [];
    employees.forEach(emp => {
      if (emp.status === 'Active') {
        const p = calculatePayslipForEmployee(emp);
        if (p) newPayslips.push(p);
      }
    });
    onGenerateMultiple(newPayslips);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Generate Payslip</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee (Or Generate All)</label>
            <select value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option value="">-- Select Employee --</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
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
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-2xl">
          <button onClick={handleGenerateAll} disabled={!startDate || !endDate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Generate for All
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <button onClick={handleGenerate} disabled={!empId || !startDate || !endDate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Generate</button>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/PayslipsModule.tsx', beforeModal + newModalCode);
