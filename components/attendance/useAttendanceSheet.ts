// components/attendance/useAttendanceSheet.ts
import { useState } from 'react'
import { generateAttendanceData, type AttendanceRecord } from './attendance-constants'

export interface UseAttendanceSheetReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  attendanceData: AttendanceRecord[]
  filteredData: AttendanceRecord[]
  formatDate: (date: Date) => string
  navigateDate: (days: number) => void
}

export function useAttendanceSheet(): UseAttendanceSheetReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendanceData] = useState(generateAttendanceData)

  const filteredData = attendanceData.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const navigateDate = (days: number): void => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    attendanceData,
    filteredData,
    formatDate,
    navigateDate,
  }
}
