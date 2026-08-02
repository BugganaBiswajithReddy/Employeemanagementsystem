const fs = require('fs');
const content = fs.readFileSync('src/components/PayslipsModule.tsx', 'utf-8');

// We need to add the new props to PayslipsModule
let newContent = content.replace(
  'interface PayslipsModuleProps {\n  employees: Employee[];\n  payslips: Payslip[];\n  onGeneratePayslip: (payslip: Payslip) => void;\n  onDeletePayslip: (id: string) => void;\n}',
  `import { AttendanceRecord } from '../types';\n\ninterface PayslipsModuleProps {\n  employees: Employee[];\n  payslips: Payslip[];\n  attendanceRecords: AttendanceRecord[];\n  onGeneratePayslip: (payslip: Payslip) => void;\n  onGenerateMultiplePayslips: (payslips: Payslip[]) => void;\n  onUpdatePayslip: (payslip: Payslip) => void;\n  onDeletePayslip: (id: string) => void;\n}`
);

// We need to update the component signature
newContent = newContent.replace(
  'export const PayslipsModule: React.FC<PayslipsModuleProps> = ({ employees, payslips, onGeneratePayslip, onDeletePayslip }) => {',
  'export const PayslipsModule: React.FC<PayslipsModuleProps> = ({ employees, payslips, attendanceRecords, onGeneratePayslip, onGenerateMultiplePayslips, onUpdatePayslip, onDeletePayslip }) => {'
);

fs.writeFileSync('src/components/PayslipsModule.tsx', newContent);
