// components/requests/requests-constants.ts
import { Calendar, FileText, Package, DollarSign } from 'lucide-react'

export interface Request {
  id: string
  type: 'leave' | 'document' | 'asset' | 'expense'
  title: string
  description: string
  requester: {
    id: string
    name: string
    initials: string
    department: string
    avatar?: string
  }
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected' | 'under-review'
  priority: 'low' | 'medium' | 'high'
  timeline: {
    step: string
    status: 'completed' | 'current' | 'pending'
    date?: string
  }[]
}

export const INITIAL_REQUESTS: Request[] = [
  {
    id: 'REQ-001',
    type: 'leave',
    title: 'Annual Leave Request',
    description: 'Requesting 5 days annual leave for family vacation',
    requester: { id: 'EMP-001', name: 'Ahmed Al Maktoum', initials: 'AM', department: 'Engineering' },
    submittedAt: '2 hours ago',
    status: 'pending',
    priority: 'medium',
    timeline: [
      { step: 'Submitted', status: 'completed', date: 'Jan 15, 2024' },
      { step: 'Manager Review', status: 'current' },
      { step: 'HR Approval', status: 'pending' },
      { step: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'REQ-002',
    type: 'document',
    title: 'Passport Upload Verification',
    description: 'New passport uploaded for verification after renewal',
    requester: { id: 'EMP-002', name: 'Sarah Johnson', initials: 'SJ', department: 'HR' },
    submittedAt: '4 hours ago',
    status: 'under-review',
    priority: 'high',
    timeline: [
      { step: 'Submitted', status: 'completed', date: 'Jan 15, 2024' },
      { step: 'Document Check', status: 'current' },
      { step: 'Verification', status: 'pending' },
      { step: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'REQ-003',
    type: 'asset',
    title: 'Laptop Request',
    description: 'Requesting MacBook Pro 14" for development work',
    requester: { id: 'EMP-003', name: 'Mohammed Hassan', initials: 'MH', department: 'Finance' },
    submittedAt: '1 day ago',
    status: 'approved',
    priority: 'medium',
    timeline: [
      { step: 'Submitted', status: 'completed', date: 'Jan 14, 2024' },
      { step: 'Manager Review', status: 'completed', date: 'Jan 14, 2024' },
      { step: 'IT Approval', status: 'completed', date: 'Jan 15, 2024' },
      { step: 'Asset Assigned', status: 'current' },
    ],
  },
  {
    id: 'REQ-004',
    type: 'expense',
    title: 'Travel Expense Reimbursement',
    description: 'Claiming travel expenses for client meeting in Abu Dhabi',
    requester: { id: 'EMP-004', name: 'Fatima Al Rashid', initials: 'FR', department: 'Marketing' },
    submittedAt: '2 days ago',
    status: 'rejected',
    priority: 'low',
    timeline: [
      { step: 'Submitted', status: 'completed', date: 'Jan 13, 2024' },
      { step: 'Manager Review', status: 'completed', date: 'Jan 14, 2024' },
      { step: 'Rejected', status: 'completed', date: 'Jan 14, 2024' },
    ],
  },
  {
    id: 'REQ-005',
    type: 'leave',
    title: 'Sick Leave',
    description: 'Requesting 1 day sick leave due to illness',
    requester: { id: 'EMP-005', name: 'James Wilson', initials: 'JW', department: 'Operations' },
    submittedAt: '3 days ago',
    status: 'approved',
    priority: 'high',
    timeline: [
      { step: 'Submitted', status: 'completed', date: 'Jan 12, 2024' },
      { step: 'Auto Approved', status: 'completed', date: 'Jan 12, 2024' },
      { step: 'Completed', status: 'completed', date: 'Jan 12, 2024' },
    ],
  },
]

export const typeConfig = {
  leave: { label: 'Leave', icon: Calendar, color: 'text-violet-glow bg-violet-core/20', borderColor: 'border-l-violet-core' },
  document: { label: 'Document', icon: FileText, color: 'text-amber-400 bg-amber-400/20', borderColor: 'border-l-amber-400' },
  asset: { label: 'Asset', icon: Package, color: 'text-teal-400 bg-teal-400/20', borderColor: 'border-l-teal-400' },
  expense: { label: 'Expense', icon: DollarSign, color: 'text-lime-400 bg-lime-400/20', borderColor: 'border-l-lime-400' },
}

export const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning-bg text-warning-text' },
  approved: { label: 'Approved', className: 'bg-success-bg text-success-text' },
  rejected: { label: 'Rejected', className: 'bg-danger-bg text-danger-text' },
  'under-review': { label: 'Under Review', className: 'bg-info-bg text-info-text' },
}

export const priorityConfig = {
  low: { label: 'Low', className: 'text-slate-400' },
  medium: { label: 'Medium', className: 'text-amber-400' },
  high: { label: 'High', className: 'text-red-400' },
}
