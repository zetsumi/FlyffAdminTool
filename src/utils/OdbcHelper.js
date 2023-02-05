import PowerShell from 'node-powershell';

const ps = new PowerShell({
  executionPolicy: 'Bypass',
  noProfile: true,
});

export default {
  async getDrivers() {
    ps.addCommand('Get-OdbcDriver | ConvertTo-Json');
    return JSON.parse(await ps.invoke());
  },
  async getDataSources() {
    ps.addCommand('Get-OdbcDsn | ConvertTo-Json');
    return JSON.parse(await ps.invoke());
  },
};
