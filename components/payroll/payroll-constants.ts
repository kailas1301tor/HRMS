// components/payroll/payroll-constants.ts
export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  initials: string
  department: string
  baseSalary: number
  allowances: number
  overtime: number
  deductions: number
  netSalary: number
  wpsStatus: 'processed' | 'pending' | 'failed'
}

export const INITIAL_PAYROLL_DATA: PayrollRecord[] = [
  {
    id: 'PAY-001',
    employeeId: 'EMP-001',
    employeeName: 'Ahmed Al Maktoum',
    initials: 'AM',
    department: 'Engineering',
    baseSalary: 25000,
    allowances: 5000,
    overtime: 2500,
    deductions: 1500,
    netSalary: 31000,
    wpsStatus: 'processed',
  },
  {
    id: 'PAY-002',
    employeeId: 'EMP-002',
    employeeName: 'Sarah Johnson',
    initials: 'SJ',
    department: 'HR',
    baseSalary: 20000,
    allowances: 4000,
    overtime: 0,
    deductions: 1200,
    netSalary: 22800,
    wpsStatus: 'processed',
  },
  {
    id: 'PAY-003',
    employeeId: 'EMP-003',
    employeeName: 'Mohammed Hassan',
    initials: 'MH',
    department: 'Finance',
    baseSalary: 18000,
    allowances: 3500,
    overtime: 1500,
    deductions: 1100,
    netSalary: 21900,
    wpsStatus: 'pending',
  },
  {
    id: 'PAY-004',
    employeeId: 'EMP-004',
    employeeName: 'Fatima Al Rashid',
    initials: 'FR',
    department: 'Marketing',
    baseSalary: 22000,
    allowances: 4500,
    overtime: 800,
    deductions: 1300,
    netSalary: 26000,
    wpsStatus: 'processed',
  },
  {
    id: 'PAY-005',
    employeeId: 'EMP-005',
    employeeName: 'James Wilson',
    initials: 'JW',
    department: 'Operations',
    baseSalary: 15000,
    allowances: 3000,
    overtime: 2000,
    deductions: 950,
    netSalary: 19050,
    wpsStatus: 'failed',
  },
]

export const monthlyData = [
  { month: 'Jul', base: 420000, allowances: 85000, overtime: 32000 },
  { month: 'Aug', base: 425000, allowances: 86000, overtime: 28000 },
  { month: 'Sep', base: 430000, allowances: 87000, overtime: 35000 },
  { month: 'Oct', base: 428000, allowances: 88000, overtime: 30000 },
  { month: 'Nov', base: 435000, allowances: 89000, overtime: 38000 },
  { month: 'Dec', base: 440000, allowances: 90000, overtime: 42000 },
]

export const wpsStatusConfig = {
  processed: { label: 'Processed', className: 'bg-success-bg text-success-text' },
  pending: { label: 'Pending', className: 'bg-warning-bg text-warning-text' },
  failed: { label: 'Failed', className: 'bg-danger-bg text-danger-text' },
}
export type WPSStatus = 'processed' | 'pending' | 'failed'
export type WPSStatusConfig = typeof wpsStatusConfig
