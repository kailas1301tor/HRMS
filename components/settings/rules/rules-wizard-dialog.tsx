// components/settings/rules/rules-wizard-dialog.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Rule, LeaveRule, PayrollRule } from '../leave-payroll-rules'

interface RulesWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaveTypes: string[]
  ruleEditIndex: number | null
  leavePayrollRules: Rule[]
  onSaveRule: (index: number | null, rule: Rule) => void
}

export function RulesWizardDialog({
  open,
  onOpenChange,
  leaveTypes,
  ruleEditIndex,
  leavePayrollRules,
  onSaveRule,
}: RulesWizardDialogProps) {
  const [rulesWizardStep, setRulesWizardStep] = useState<'select' | 'leave' | 'payroll'>('select')

  // Leave Rule Form Fields
  const [ruleLeaveType, setRuleLeaveType] = useState('')
  const [ruleMaxDays, setRuleMaxDays] = useState('')
  const [ruleCarryForward, setRuleCarryForward] = useState('')
  const [ruleAccrualRate, setRuleAccrualRate] = useState('')
  const [ruleAccrualFreq, setRuleAccrualFreq] = useState('Monthly')
  const [ruleIsPaid, setRuleIsPaid] = useState(true)
  const [ruleDescription, setRuleDescription] = useState('')

  // Payroll Rule Form Fields
  const [rulePayName, setRulePayName] = useState('')
  const [rulePayCategory, setRulePayCategory] = useState<'Allowance' | 'Deduction'>('Allowance')
  const [rulePayTrigger, setRulePayTrigger] = useState('None (Fixed / Flat)')
  const [rulePayCalcType, setRulePayCalcType] = useState<'Fixed Amount' | 'Percentage (%)'>('Fixed Amount')
  const [rulePayValue, setRulePayValue] = useState('')
  const [rulePayBase, setRulePayBase] = useState('Basic Salary')
  const [rulePayApplyAutomatically, setRulePayApplyAutomatically] = useState(true)

  useEffect(() => {
    if (open) {
      if (ruleEditIndex !== null) {
        const rule = leavePayrollRules[ruleEditIndex]
        if (rule) {
          if (rule.type === 'leave') {
            setRuleLeaveType(rule.leaveType)
            setRuleMaxDays(rule.maxDays)
            setRuleCarryForward(rule.carryForwardLimit)
            setRuleAccrualRate(rule.accrualRate)
            setRuleAccrualFreq(rule.accrualFrequency)
            setRuleIsPaid(rule.isPaid)
            setRuleDescription(rule.description)
            setRulesWizardStep('leave')
          } else {
            setRulePayName(rule.name)
            setRulePayCategory(rule.category)
            setRulePayTrigger(rule.triggerBasis)
            setRulePayCalcType(rule.calculationType)
            setRulePayValue(rule.value)
            setRulePayBase(rule.baseIfPercentage)
            setRulePayApplyAutomatically(rule.applyAutomatically)
            setRulesWizardStep('payroll')
          }
        }
      } else {
        setRulesWizardStep('select')
        setRuleLeaveType(leaveTypes[0] || 'ANNUAL LEAVE')
        setRuleMaxDays('')
        setRuleCarryForward('')
        setRuleAccrualRate('')
        setRuleAccrualFreq('Monthly')
        setRuleIsPaid(true)
        setRuleDescription('')

        setRulePayName('')
        setRulePayCategory('Allowance')
        setRulePayTrigger('None (Fixed / Flat)')
        setRulePayCalcType('Fixed Amount')
        setRulePayValue('')
        setRulePayBase('Basic Salary')
        setRulePayApplyAutomatically(true)
      }
    }
  }, [open, ruleEditIndex, leavePayrollRules, leaveTypes])

  const handleSaveLeaveRule = (e: React.FormEvent) => {
    e.preventDefault()
    const newRule: LeaveRule = {
      id: ruleEditIndex !== null ? leavePayrollRules[ruleEditIndex]?.id || 'rule-' + Date.now() : 'rule-' + Date.now(),
      type: 'leave',
      leaveType: ruleLeaveType || leaveTypes[0] || 'ANNUAL LEAVE',
      maxDays: ruleMaxDays.trim(),
      carryForwardLimit: ruleCarryForward.trim(),
      accrualRate: ruleAccrualRate.trim(),
      accrualFrequency: ruleAccrualFreq,
      isPaid: ruleIsPaid,
      description: ruleDescription.trim(),
    }
    onSaveRule(ruleEditIndex, newRule)
    onOpenChange(false)
  }

  const handleSavePayrollRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rulePayName.trim()) return

    const newRule: PayrollRule = {
      id: ruleEditIndex !== null ? leavePayrollRules[ruleEditIndex]?.id || 'rule-' + Date.now() : 'rule-' + Date.now(),
      type: 'payroll',
      name: rulePayName.trim(),
      category: rulePayCategory,
      triggerBasis: rulePayTrigger,
      calculationType: rulePayCalcType,
      value: rulePayValue.trim(),
      baseIfPercentage: rulePayBase,
      applyAutomatically: rulePayApplyAutomatically,
    }
    onSaveRule(ruleEditIndex, newRule)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg font-sans">
            {ruleEditIndex !== null ? 'Edit Rule Configuration' : 'Configure New Rule'}
          </DialogTitle>
        </DialogHeader>

        {rulesWizardStep === 'select' && (
          <div className="space-y-4 pt-4">
            <p className="text-sm text-slate-300">Select the type of rule you would like to configure:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRulesWizardStep('leave')}
                className="p-5 bg-midnight/55 border border-border/85 rounded-2xl hover:border-violet-core/50 hover:bg-violet-core/5 transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <span className="text-base font-bold text-cloud">Leave Policy</span>
                <span className="text-xs text-slate-400">Configure annual limits, carries, and accruals</span>
              </button>
              <button
                type="button"
                onClick={() => setRulesWizardStep('payroll')}
                className="p-5 bg-midnight/55 border border-border/85 rounded-2xl hover:border-violet-core/50 hover:bg-violet-core/5 transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <span className="text-base font-bold text-cloud">Payroll Component</span>
                <span className="text-xs text-slate-400">Configure allowances, deductions, and calculations</span>
              </button>
            </div>
          </div>
        )}

        {rulesWizardStep === 'leave' && (
          <form onSubmit={handleSaveLeaveRule} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Leave Type</Label>
                <Select value={ruleLeaveType} onValueChange={setRuleLeaveType}>
                  <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule-max-days" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Max Days / Year</Label>
                <Input id="rule-max-days" value={ruleMaxDays} onChange={(e) => setRuleMaxDays(e.target.value)} placeholder="e.g. 30" className="bg-midnight border-border rounded-xl text-sm" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-carry-forward" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Carry Forward Limit</Label>
                <Input id="rule-carry-forward" value={ruleCarryForward} onChange={(e) => setRuleCarryForward(e.target.value)} placeholder="e.g. 15" className="bg-midnight border-border rounded-xl text-sm" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule-accrual-rate" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accrual Rate</Label>
                <Input id="rule-accrual-rate" value={ruleAccrualRate} onChange={(e) => setRuleAccrualRate(e.target.value)} placeholder="e.g. 2.5" className="bg-midnight border-border rounded-xl text-sm" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accrual Frequency</Label>
                <Select value={ruleAccrualFreq} onValueChange={setRuleAccrualFreq}>
                  <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex flex-col justify-end pb-2.5">
                <div className="flex items-center gap-3">
                  <Switch checked={ruleIsPaid} onCheckedChange={setRuleIsPaid} />
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">Paid Leave</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rule-desc" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rule Description</Label>
              <Input id="rule-desc" value={ruleDescription} onChange={(e) => setRuleDescription(e.target.value)} placeholder="e.g. Standard annual leave policy accrues monthly." className="bg-midnight border-border rounded-xl text-sm" />
            </div>

            <DialogFooter className="pt-4 border-t border-border/40 flex items-center justify-between">
              {ruleEditIndex === null ? (
                <Button type="button" variant="link" onClick={() => setRulesWizardStep('select')} className="text-xs text-violet-glow hover:underline cursor-pointer">
                  Back to Selection
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <DialogClose asChild><Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer">Cancel</Button></DialogClose>
                <Button type="submit" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer">Save Policy</Button>
              </div>
            </DialogFooter>
          </form>
        )}

        {rulesWizardStep === 'payroll' && (
          <form onSubmit={handleSavePayrollRule} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-pay-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Component Name</Label>
                <Input id="rule-pay-name" value={rulePayName} onChange={(e) => setRulePayName(e.target.value)} placeholder="e.g. HRA, PF" className="bg-midnight border-border rounded-xl text-sm" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</Label>
                <Select value={rulePayCategory} onValueChange={(val: any) => setRulePayCategory(val)}>
                  <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Allowance">Allowance</SelectItem>
                    <SelectItem value="Deduction">Deduction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trigger Basis</Label>
                <Select value={rulePayTrigger} onValueChange={setRulePayTrigger}>
                  <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None (Fixed / Flat)">None (Fixed / Flat)</SelectItem>
                    <SelectItem value="Hourly Attendance">Hourly Attendance</SelectItem>
                    <SelectItem value="Late Deductions">Late Deductions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calculation Type</Label>
                <Select value={rulePayCalcType} onValueChange={(val: any) => setRulePayCalcType(val)}>
                  <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                    <SelectItem value="Percentage (%)">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-pay-val" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Value</Label>
                <Input id="rule-pay-val" value={rulePayValue} onChange={(e) => setRulePayValue(e.target.value)} placeholder="e.g. 500 or 10" className="bg-midnight border-border rounded-xl text-sm" required />
              </div>
              {rulePayCalcType === 'Percentage (%)' ? (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Percentage Base</Label>
                  <Select value={rulePayBase} onValueChange={setRulePayBase}>
                    <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic Salary">Basic Salary</SelectItem>
                      <SelectItem value="Gross Salary">Gross Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col justify-end pb-2.5">
                  <div className="flex items-center gap-3">
                    <Switch checked={rulePayApplyAutomatically} onCheckedChange={setRulePayApplyAutomatically} />
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">Auto-Apply</Label>
                  </div>
                </div>
              )}
            </div>

            {rulePayCalcType === 'Percentage (%)' && (
              <div className="space-y-2 flex items-center gap-3 pt-2">
                <Switch checked={rulePayApplyAutomatically} onCheckedChange={setRulePayApplyAutomatically} />
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">Apply Automatically</Label>
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-border/40 flex items-center justify-between">
              {ruleEditIndex === null ? (
                <Button type="button" variant="link" onClick={() => setRulesWizardStep('select')} className="text-xs text-violet-glow hover:underline cursor-pointer">
                  Back to Selection
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <DialogClose asChild><Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer">Cancel</Button></DialogClose>
                <Button type="submit" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer">Save Component</Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
