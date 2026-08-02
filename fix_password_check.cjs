const fs = require('fs');

let file = 'src/components/EmployeeChangePassword.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(
  "interface Props {",
  "interface Props {\n  actualPassword: string;"
);

code = code.replace(
  "export const EmployeeChangePassword: React.FC<Props> = ({ onPasswordChanged, onLogout }) => {",
  "export const EmployeeChangePassword: React.FC<Props> = ({ actualPassword, onPasswordChanged, onLogout }) => {"
);

code = code.replace(
  "if (newPassword !== confirmPassword) {",
  "if (currentPassword !== actualPassword) {\n      setError('Current password is incorrect.');\n      return;\n    }\n\n    if (newPassword !== confirmPassword) {"
);

fs.writeFileSync(file, code);

let appFile = 'src/App.tsx';
let appCode = fs.readFileSync(appFile, 'utf-8');
appCode = appCode.replace(
  "<EmployeeChangePassword",
  "<EmployeeChangePassword actualPassword={employee.password!}"
);
fs.writeFileSync(appFile, appCode);
