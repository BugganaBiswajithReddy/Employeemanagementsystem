const fs = require('fs');

const files = ['src/components/UnifiedLogin.tsx', 'src/components/EmployeeDashboardView.tsx'];
for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/\\\$/g, '$');
  fs.writeFileSync(file, code);
}
