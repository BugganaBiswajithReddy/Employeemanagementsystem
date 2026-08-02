export const AuthService = {
  getCredentials() {
    const creds = localStorage.getItem('ems_admin_creds');
    if (creds) return JSON.parse(creds);
    const defaultCreds = { username: 'admin', password: 'password123' };
    localStorage.setItem('ems_admin_creds', JSON.stringify(defaultCreds));
    return defaultCreds;
  },
  
  verifyCredentials(username: string, pass: string) {
    const creds = this.getCredentials();
    return creds.username === username && creds.password === pass;
  },
  
  updatePassword(oldPass: string, newPass: string) {
    const creds = this.getCredentials();
    if (creds.password !== oldPass) {
      throw new Error('Incorrect old password');
    }
    creds.password = newPass;
    localStorage.setItem('ems_admin_creds', JSON.stringify(creds));
    return true;
  }
};
