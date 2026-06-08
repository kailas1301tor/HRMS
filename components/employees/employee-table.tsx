// components/employees/employee-table.tsx
'use client'

import { AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ArrowUpDown, UserX } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmployeeProfileDrawer } from './employee-profile-drawer'
import { AddEmployeeModal } from './add-employee-modal'
import { EmployeeTableFilters } from './employee-table-filters'
import { EmployeeTableRow } from './employee-table-row'
import { statusConfig, departmentConfig } from './employee-constants'
import { cn } from '@/lib/utils'
import { useEmployeeTable } from './useEmployeeTable'
import { DeleteEmployeeDialog } from './delete-employee-dialog'
import { TablePagination } from './table-pagination'

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

export function EmployeeTable() {
  const {
    employeeList,
    pagination,
    selectedEmployee,
    drawerOpen,
    isAddModalOpen,
    editTarget,
    isTableLoading,
    dropdowns,
    deleteTargetId,
    isDeleting,
    searchQuery,
    departmentFilter,
    statusFilter,
    sortField,
    sortOrder,
    activeTab,
    sortedEmployees,
    setSelectedEmployee,
    setDrawerOpen,
    setIsAddModalOpen,
    setDeleteTargetId,
    setEditTarget,
    fetchEmployees,
    updateQueryParams,
    handleToggleStatus,
    handleSort,
    handleDelete,
    executeDelete,
    handleEdit,
  } = useEmployeeTable()

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  return (
    <>
      {/* Directory Tabs */}
      <div className="flex gap-1.5 border-b border-border/40 pb-3 mb-6">
        {[
          { id: 'all', label: 'All Employees' },
          { id: 'onboarding', label: 'Onboarding Checklist' },
          { id: 'offboarding', label: 'Offboarding Checklist' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => updateQueryParams({ tab: t.id === 'all' ? null : t.id, page: '1' })}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border',
              activeTab === t.id
                ? 'bg-violet-core/20 text-violet-glow border-violet-core/30 font-medium'
                : 'text-slate-400 hover:text-cloud hover:bg-midnight/60 border-transparent'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

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
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-3 rounded w-24" />
                          <Skeleton className="h-2 rounded w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Skeleton className="h-5 rounded-lg w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3 rounded w-28" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 rounded-full w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 rounded w-8" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3 rounded w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 rounded w-4" /></td>
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

        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          itemCount={employeeList.length}
          onPageChange={(page) => updateQueryParams({ page: String(page) })}
          isTableLoading={isTableLoading}
        />
      </div>

      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => fetchEmployees()}
        editEmployee={editTarget}
      />

      <EmployeeProfileDrawer
        employee={selectedEmployee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
      />

      <DeleteEmployeeDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={executeDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
