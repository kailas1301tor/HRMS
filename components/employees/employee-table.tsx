// components/employees/employee-table.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ArrowUpDown, Loader2, UserX } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { employeeService, type DropdownData } from '@/services/employee-service'
import { Button } from '@/components/ui/button'
import { EmployeeProfileDrawer } from './employee-profile-drawer'
import { AddEmployeeModal } from './add-employee-modal'
import { EmployeeTableFilters } from './employee-table-filters'
import { EmployeeTableRow } from './employee-table-row'
import { statusConfig, departmentConfig } from './employee-constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface Employee {
  id: number
  user: {
    username: string
    email: string
  }
  bank_details: {
    bank_name: string
    account_number: string
    ifsc: string
    branch: string
  }
  full_name: string
  phone_number: string
  employee_id: string
  role: number
  role_name?: string
  department: string
  designation: string
  status: string
  shift: string
  employee_type: string
  nationality: string
  joined_date: string
  basic_salary: string
  accommodation: string
  date_of_birth: string
  address: string
}

type SortField = 'full_name' | 'department' | 'designation' | 'joined_date' | 'status'
type SortOrder = 'asc' | 'desc'

export function EmployeeTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Employee | null>(null)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState<DropdownData | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const searchQuery = searchParams.get('search') || ''
  const departmentFilter = searchParams.get('department') || ''
  const statusFilter = searchParams.get('status') || ''
  const pageParam = Number(searchParams.get('page')) || 1
  const sortField = (searchParams.get('sortField') as SortField) || 'full_name'
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc'

  const fetchEmployees = async () => {
    setIsTableLoading(true)
    try {
      const response = await employeeService.getEmployees({
        page: pageParam,
        page_size: 10,
        search: searchQuery || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
      })
      setEmployeeList(response.data)
      setPagination({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      })
    } catch (error) {
      toast.error('Failed to load employees')
    } finally {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [searchQuery, departmentFilter, statusFilter, pageParam])

  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await employeeService.getDropdowns()
        setDropdowns(data)
      } catch (err) {
        console.error('Failed to load filter metadata:', err)
      }
    }
    loadFilters()
  }, [])

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  const handleToggleStatus = async (employee: Employee, active: boolean) => {
    const nextStatus = active ? 'Active' : 'Inactive'
    try {
      await employeeService.updateEmployee({ id: employee.id, status: nextStatus })
      toast.success(`Status updated to ${nextStatus}`)
      fetchEmployees()
    } catch (err) {
      toast.error('Failed to update employee status')
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      updateQueryParams({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      updateQueryParams({ sortField: field, sortOrder: 'asc' })
    }
  }

  const handleDelete = (id: number) => {
    setDeleteTargetId(id)
  }

  const executeDelete = async () => {
    if (deleteTargetId === null) return
    setIsDeleting(true)
    try {
      await employeeService.deleteEmployee(deleteTargetId)
      toast.success('Employee deleted successfully')
      setDeleteTargetId(null)
      fetchEmployees()
    } catch (err: any) {
      toast.error('Failed to delete employee', {
        description: err.message || 'Error occurred during deletion'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditTarget(employee)
    setIsAddModalOpen(true)
  }

  const sortedEmployees = [...employeeList].sort((a, b) => {
    const aVal = a[sortField] || ''
    const bVal = b[sortField] || ''
    const order = sortOrder === 'asc' ? 1 : -1
    return aVal < bVal ? -order : aVal > bVal ? order : 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  return (
    <>
      <EmployeeTableFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => updateQueryParams({ search: val, page: '1' })}
        departmentFilter={departmentFilter}
        onDepartmentChange={(val) => updateQueryParams({ department: val, page: '1' })}
        statusFilter={statusFilter}
        onStatusChange={(val) => updateQueryParams({ status: val, page: '1' })}
        dropdowns={dropdowns}
        onAddClick={() => {
          setEditTarget(null)
          setIsAddModalOpen(true)
        }}
      />

      <div className="bg-carbon border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { id: 'full_name', label: 'Employee' },
                  { id: 'department', label: 'Department' },
                  { id: 'designation', label: 'Position' },
                  { id: 'status', label: 'Status' }
                ].map(col => (
                  <th key={col.id} className="text-left px-4 py-3">
                    <button onClick={() => handleSort(col.id as SortField)} className="flex items-center text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-cloud transition-colors">
                      {col.label} <SortIcon field={col.id as SortField} />
                    </button>
                  </th>
                ))}
                <th className="text-left px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Active</span>
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => handleSort('joined_date')} className="flex items-center text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-cloud transition-colors">
                    Join Date <SortIcon field="joined_date" />
                  </button>
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800/80" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3 bg-slate-700/80 rounded w-24" />
                          <div className="h-2 bg-slate-800/80 rounded w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-5 bg-slate-800/80 rounded-lg w-20" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-slate-700/80 rounded w-28" /></td>
                    <td className="px-4 py-3"><div className="h-6 bg-slate-800/80 rounded-full w-16" /></td>
                    <td className="px-4 py-3"><div className="h-5 bg-slate-800/80 rounded w-8" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-slate-800/80 rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-slate-800/80 rounded w-4" /></td>
                  </tr>
                ))
              ) : sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-850 border border-border/40 flex items-center justify-center text-slate-500 mb-2">
                        <UserX className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-350">No employees found</p>
                      <p className="text-xs text-slate-500 max-w-[280px]">
                        We couldn't find any employees matching your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {sortedEmployees.map((employee, index) => (
                    <EmployeeTableRow
                      key={employee.id}
                      employee={employee}
                      index={index}
                      onSelect={() => {
                        setSelectedEmployee(employee)
                        setDrawerOpen(true)
                      }}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      departmentConfig={departmentConfig}
                      statusConfig={statusConfig}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-cloud">{employeeList.length}</span> of{' '}
            <span className="font-medium text-cloud">{pagination.totalCount}</span> employees
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1 || isTableLoading}
              onClick={() => updateQueryParams({ page: String(pagination.currentPage - 1) })}
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className={cn(pagination.currentPage === p && "bg-violet-core/20 border-violet-core text-violet-glow")}
                disabled={isTableLoading}
                onClick={() => updateQueryParams({ page: String(p) })}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages || isTableLoading}
              onClick={() => updateQueryParams({ page: String(pagination.currentPage + 1) })}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchEmployees}
        editEmployee={editTarget}
      />

      <EmployeeProfileDrawer
        employee={selectedEmployee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
      />

      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Delete Employee Profile
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm font-sans mt-2">
              Are you sure you want to delete this employee? This action is permanent and cannot be undone. All associated data will be deactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/40">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="h-10 rounded-xl" disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              onClick={executeDelete}
              className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-xl px-5 flex items-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Delete Employee'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
