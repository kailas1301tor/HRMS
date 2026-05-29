// components/documents/documents-constants.ts
import { CheckCircle, Clock, AlertTriangle, FileText, File, Image } from 'lucide-react'

export interface Document {
  id: string
  name: string
  type: 'id' | 'visa' | 'passport' | 'insurance' | 'license' | 'contract'
  fileType: 'pdf' | 'doc' | 'img'
  employeeId: string
  employeeName: string
  uploadDate: string
  expiryDate: string
  daysUntilExpiry: number
  status: 'valid' | 'expiring' | 'expired'
  size: string
}

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'DOC-001',
    name: 'Emirates ID - Ahmed Al Maktoum',
    type: 'id',
    fileType: 'img',
    employeeId: 'EMP-001',
    employeeName: 'Ahmed Al Maktoum',
    uploadDate: '2023-06-15',
    expiryDate: '2024-01-15',
    daysUntilExpiry: -10,
    status: 'expired',
    size: '2.4 MB',
  },
  {
    id: 'DOC-002',
    name: 'Work Visa - Sarah Johnson',
    type: 'visa',
    fileType: 'pdf',
    employeeId: 'EMP-002',
    employeeName: 'Sarah Johnson',
    uploadDate: '2023-08-20',
    expiryDate: '2024-02-05',
    daysUntilExpiry: 12,
    status: 'expiring',
    size: '1.8 MB',
  },
  {
    id: 'DOC-003',
    name: 'Passport - Mohammed Hassan',
    type: 'passport',
    fileType: 'img',
    employeeId: 'EMP-003',
    employeeName: 'Mohammed Hassan',
    uploadDate: '2023-04-10',
    expiryDate: '2024-02-20',
    daysUntilExpiry: 27,
    status: 'expiring',
    size: '3.1 MB',
  },
  {
    id: 'DOC-004',
    name: 'Medical Insurance - Fatima Al Rashid',
    type: 'insurance',
    fileType: 'pdf',
    employeeId: 'EMP-004',
    employeeName: 'Fatima Al Rashid',
    uploadDate: '2023-12-01',
    expiryDate: '2024-06-15',
    daysUntilExpiry: 142,
    status: 'valid',
    size: '856 KB',
  },
  {
    id: 'DOC-005',
    name: 'Driving License - James Wilson',
    type: 'license',
    fileType: 'img',
    employeeId: 'EMP-005',
    employeeName: 'James Wilson',
    uploadDate: '2023-09-15',
    expiryDate: '2024-08-30',
    daysUntilExpiry: 218,
    status: 'valid',
    size: '1.2 MB',
  },
  {
    id: 'DOC-006',
    name: 'Employment Contract - Priya Sharma',
    type: 'contract',
    fileType: 'pdf',
    employeeId: 'EMP-006',
    employeeName: 'Priya Sharma',
    uploadDate: '2022-08-15',
    expiryDate: '2025-08-15',
    daysUntilExpiry: 560,
    status: 'valid',
    size: '425 KB',
  },
]

export const statusConfig = {
  valid: {
    label: 'Valid',
    className: 'bg-success-bg text-success-text',
    borderColor: 'border-l-lime-400',
    icon: CheckCircle,
  },
  expiring: {
    label: 'Expiring Soon',
    className: 'bg-warning-bg text-warning-text',
    borderColor: 'border-l-amber-400',
    icon: Clock,
  },
  expired: {
    label: 'Expired',
    className: 'bg-danger-bg text-danger-text',
    borderColor: 'border-l-red-500',
    icon: AlertTriangle,
  },
}

export const typeConfig = {
  id: { label: 'ID Document', icon: FileText, color: 'text-violet-glow' },
  visa: { label: 'Visa', icon: FileText, color: 'text-teal-400' },
  passport: { label: 'Passport', icon: FileText, color: 'text-amber-400' },
  insurance: { label: 'Insurance', icon: FileText, color: 'text-lime-400' },
  license: { label: 'License', icon: FileText, color: 'text-blue-400' },
  contract: { label: 'Contract', icon: FileText, color: 'text-pink-400' },
}

export const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-red-400 bg-red-400/20' },
  doc: { icon: File, color: 'text-blue-400 bg-blue-400/20' },
  img: { icon: Image, color: 'text-lime-400 bg-lime-400/20' },
}
