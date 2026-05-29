// components/attendance/attendance-constants.ts

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  initials: string
  department: string
  shift: 'morning' | 'evening' | 'night'
  date: string
  timeIn: string | null
  timeOut: string | null
  status: 'present' | 'late' | 'absent' | 'leave' | 'weekend'
  workHours: string | null
}

export const generateAttendanceData = (): AttendanceRecord[] => {
  const employees = [
    { id: 'EMP-001', name: 'Ahmed Al Maktoum', initials: 'AM', department: 'Engineering' },
    { id: 'EMP-002', name: 'Sarah Johnson', initials: 'SJ', department: 'HR' },
    { id: 'EMP-003', name: 'Mohammed Hassan', initials: 'MH', department: 'Finance' },
    { id: 'EMP-004', name: 'Fatima Al Rashid', initials: 'FR', department: 'Marketing' },
    { id: 'EMP-005', name: 'James Wilson', initials: 'JW', department: 'Operations' },
    { id: 'EMP-006', name: 'Priya Sharma', initials: 'PS', department: 'Engineering' },
    { id: 'EMP-007', name: 'Omar Khalid', initials: 'OK', department: 'Engineering' },
  ]

  const shifts: ('morning' | 'evening' | 'night')[] = ['morning', 'evening', 'night']
  const today = new Date()

  return employees.map((emp, index) => {
    const isWeekend = today.getDay() === 0 || today.getDay() === 6
    const randomStatus = Math.random()
    let status: AttendanceRecord['status'] = 'present'
    
    if (isWeekend) {
      status = 'weekend'
    } else if (randomStatus > 0.9) {
      status = 'absent'
    } else if (randomStatus > 0.8) {
      status = 'late'
    } else if (randomStatus > 0.7) {
      status = 'leave'
    }

    const timeIn = status === 'present' ? '09:00' : status === 'late' ? '09:45' : null
    const timeOut = status === 'present' || status === 'late' ? '18:00' : null

    return {
      id: `ATT-${String(index + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: emp.name,
      initials: emp.initials,
      department: emp.department,
      shift: shifts[index % 3],
      date: today.toISOString().split('T')[0],
      timeIn,
      timeOut,
      status,
      workHours: timeIn && timeOut ? '8h 00m' : null,
    }
  })
}

export const STATUS_CONFIG = {
  present: { label: 'Present', color: 'bg-lime-400', dotColor: 'bg-lime-400' },
  late: { label: 'Late', color: 'bg-amber-400', dotColor: 'bg-amber-400' },
  absent: { label: 'Absent', color: 'bg-red-400', dotColor: 'bg-red-400' },
  leave: { label: 'On Leave', color: 'bg-slate-400', dotColor: 'bg-slate-400' },
  weekend: { label: 'Weekend', color: 'bg-slate-600', dotColor: 'bg-slate-600' },
} as const

export const SHIFT_CONFIG = {
  morning: { label: 'Morning', time: '9:00 - 18:00', className: 'bg-violet-core/20 text-violet-glow' },
  evening: { label: 'Evening', time: '14:00 - 23:00', className: 'bg-amber-400/20 text-amber-400' },
  night: { label: 'Night', time: '22:00 - 7:00', className: 'bg-teal-400/20 text-teal-400' },
} as const
