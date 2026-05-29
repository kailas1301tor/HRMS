// components/assets/assets-constants.ts
import { Laptop, Smartphone, Monitor, Car, Printer, Headphones, Package } from 'lucide-react'
import type { BackendAsset } from '@/services/asset-service'

export const categoryConfig = {
  laptop: { label: 'Laptop', icon: Laptop, color: 'text-violet-glow bg-violet-core/20' },
  phone: { label: 'Phone', icon: Smartphone, color: 'text-teal-400 bg-teal-400/20' },
  monitor: { label: 'Monitor', icon: Monitor, color: 'text-blue-400 bg-blue-400/20' },
  vehicle: { label: 'Vehicle', icon: Car, color: 'text-amber-400 bg-amber-400/20' },
  printer: { label: 'Printer', icon: Printer, color: 'text-pink-400 bg-pink-400/20' },
  headset: { label: 'Headset', icon: Headphones, color: 'text-lime-400 bg-lime-400/20' },
  other: { label: 'Other', icon: Package, color: 'text-slate-400 bg-slate-400/20' },
}

export function getAssetTypeConfig(typeName: string = '') {
  const name = typeName.toLowerCase();
  if (name.includes('laptop')) return { label: typeName, icon: Laptop, color: 'text-violet-glow bg-violet-core/20' };
  if (name.includes('desktop') || name.includes('monitor')) return { label: typeName, icon: Monitor, color: 'text-blue-400 bg-blue-400/20' };
  if (name.includes('phone') || name.includes('mobile')) return { label: typeName, icon: Smartphone, color: 'text-teal-400 bg-teal-400/20' };
  if (name.includes('car') || name.includes('vehicle')) return { label: typeName, icon: Car, color: 'text-amber-400 bg-amber-400/20' };
  if (name.includes('printer')) return { label: typeName, icon: Printer, color: 'text-pink-400 bg-pink-400/20' };
  if (name.includes('headset') || name.includes('headphone')) return { label: typeName, icon: Headphones, color: 'text-lime-400 bg-lime-400/20' };
  return { label: typeName || 'Other', icon: Package, color: 'text-slate-400 bg-slate-400/20' };
}

export function getStatusConfig(statusName: string = '') {
  const name = statusName.toLowerCase();
  if (name.includes('assigned') || name.includes('in-service') || name.includes('in service')) {
    return { label: statusName, className: 'bg-info-bg text-info-text' };
  }
  if (name.includes('repair') || name.includes('maintenance')) {
    return { label: statusName, className: 'bg-warning-bg text-warning-text' };
  }
  if (name.includes('store') || name.includes('in-store')) {
    return { label: statusName, className: 'bg-neutral-bg text-neutral-text' };
  }
  if (name.includes('disposed') || name.includes('deleted')) {
    return { label: statusName, className: 'bg-danger-bg text-danger-text' };
  }
  return { label: statusName || 'Unknown', className: 'bg-slate-800 text-slate-400' };
}

export const INITIAL_ASSETS: BackendAsset[] = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    asset_type: 'Laptop',
    asset_category: 'Electronics',
    serial_number: 'C02X1234ABCD',
    purchase_date: '2023-03-15',
    purchase_cost: '8500',
    status: 'Assigned',
    department: 'ENGINEERING',
    location: 'HQ - Floor 3',
    sub_location: 'Desk 12',
    warranty_period: 12,
    service_due_date: '2024-03-15',
    is_active: true,
    deleted: false,
    created_at: '2023-03-15T00:00:00Z',
    updated_at: '2023-03-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    asset_type: 'Phone',
    asset_category: 'Electronics',
    serial_number: 'DNXYZ9876543',
    purchase_date: '2023-09-20',
    purchase_cost: '4200',
    status: 'Assigned',
    department: 'HR',
    location: 'HQ - Floor 2',
    sub_location: 'Desk 4',
    warranty_period: 12,
    service_due_date: '2024-09-20',
    is_active: true,
    deleted: false,
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z'
  },
  {
    id: 3,
    name: 'Dell UltraSharp 27"',
    asset_type: 'Monitor',
    asset_category: 'Electronics',
    serial_number: 'DELL27ABC123',
    purchase_date: '2022-11-10',
    purchase_cost: '2100',
    status: 'Assigned',
    department: 'FINANCE',
    location: 'HQ - Floor 1',
    sub_location: 'Reception',
    warranty_period: 24,
    service_due_date: '2024-11-10',
    is_active: true,
    deleted: false,
    created_at: '2022-11-10T00:00:00Z',
    updated_at: '2022-11-10T00:00:00Z'
  },
  {
    id: 4,
    name: 'Toyota Camry 2023',
    asset_type: 'Vehicle',
    asset_category: 'Logistics',
    serial_number: '6T1BF3EK5PX123456',
    purchase_date: '2023-01-05',
    purchase_cost: '95000',
    status: 'Assigned',
    department: 'MARKETING',
    location: 'Parking B2',
    sub_location: 'Slot 14',
    warranty_period: 36,
    service_due_date: '2024-01-05',
    is_active: true,
    deleted: false,
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z'
  },
  {
    id: 5,
    name: 'HP LaserJet Pro',
    asset_type: 'Printer',
    asset_category: 'Electronics',
    serial_number: 'HPLJ2023XYZ',
    purchase_date: '2023-06-01',
    purchase_cost: '1850',
    status: 'In Repair',
    department: 'IT',
    location: 'HQ - Floor 2 Print Room',
    sub_location: 'Table 1',
    warranty_period: 12,
    service_due_date: '2024-06-01',
    is_active: true,
    deleted: false,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  }
]
