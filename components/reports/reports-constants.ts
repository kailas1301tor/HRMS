// components/reports/reports-constants.ts

export interface HeadcountMonthData {
  month: string
  employees: number
  hires: number
  departures: number
}

export interface AttendanceMonthData {
  month: string
  present: number
  absent: number
  late: number
}

export interface PayrollMonthData {
  month: string
  gross: number
  net: number
  deductions: number
}

export interface DepartmentBreakdownData {
  name: string
  value: number
  color: string
}

export interface ReportTemplate {
  id: number
  name: string
  description: string
  category: string
  lastGenerated: string
}

export const HEADCOUNT_DATA: HeadcountMonthData[] = [
  { month: "Jan", employees: 142, hires: 8, departures: 3 },
  { month: "Feb", employees: 147, hires: 7, departures: 2 },
  { month: "Mar", employees: 152, hires: 9, departures: 4 },
  { month: "Apr", employees: 156, hires: 6, departures: 2 },
  { month: "May", employees: 161, hires: 8, departures: 3 },
  { month: "Jun", employees: 168, hires: 10, departures: 3 },
]

export const ATTENDANCE_DATA: AttendanceMonthData[] = [
  { month: "Jan", present: 95.2, absent: 2.8, late: 2.0 },
  { month: "Feb", present: 94.8, absent: 3.0, late: 2.2 },
  { month: "Mar", present: 96.1, absent: 2.2, late: 1.7 },
  { month: "Apr", present: 95.5, absent: 2.5, late: 2.0 },
  { month: "May", present: 94.9, absent: 2.8, late: 2.3 },
  { month: "Jun", present: 96.3, absent: 2.0, late: 1.7 },
]

export const PAYROLL_DATA: PayrollMonthData[] = [
  { month: "Jan", gross: 485000, net: 362000, deductions: 123000 },
  { month: "Feb", gross: 492000, net: 368000, deductions: 124000 },
  { month: "Mar", gross: 498000, net: 372000, deductions: 126000 },
  { month: "Apr", gross: 510000, net: 381000, deductions: 129000 },
  { month: "May", gross: 525000, net: 392000, deductions: 133000 },
  { month: "Jun", gross: 542000, net: 405000, deductions: 137000 },
]

export const DEPARTMENT_BREAKDOWN: DepartmentBreakdownData[] = [
  { name: "Engineering", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Sales", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Marketing", value: 18, color: "hsl(var(--chart-3))" },
  { name: "HR", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Finance", value: 15, color: "hsl(var(--chart-5))" },
  { name: "Operations", value: 50, color: "hsl(var(--primary))" },
]

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 1,
    name: "Monthly Headcount Report",
    description: "Employee count, hires, and departures by department",
    category: "HR",
    lastGenerated: "2024-01-15",
  },
  {
    id: 2,
    name: "Attendance Summary",
    description: "Attendance rates, tardiness, and leave utilization",
    category: "Attendance",
    lastGenerated: "2024-01-14",
  },
  {
    id: 3,
    name: "Payroll Summary",
    description: "Gross pay, deductions, and net pay by department",
    category: "Payroll",
    lastGenerated: "2024-01-10",
  },
  {
    id: 4,
    name: "Asset Inventory",
    description: "Complete asset listing with assignments and conditions",
    category: "Assets",
    lastGenerated: "2024-01-12",
  },
  {
    id: 5,
    name: "Document Compliance",
    description: "Document expiry status and compliance tracking",
    category: "Documents",
    lastGenerated: "2024-01-08",
  },
  {
    id: 6,
    name: "Leave Balance Report",
    description: "Employee leave balances and utilization rates",
    category: "Leave",
    lastGenerated: "2024-01-11",
  },
]
