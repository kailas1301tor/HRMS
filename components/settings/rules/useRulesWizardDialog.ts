// components/settings/rules/useRulesWizardDialog.ts
import { useState, useEffect } from 'react'
import type { Rule, LeaveRule, PayrollRule } from '../leave-payroll-rules'

export interface UseRulesWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaveTypes: string[]
  ruleEditIndex: number | null
  leavePayrollRules: Rule[]
  onSaveRule: (index: number | null, rule: Rule) => void
}

export interface UseRulesWizardDialogReturn {
  rulesWizardStep: 'select' | 'leave' | 'payroll'
  setRulesWizardStep: (step: 'select' | 'leave' | 'payroll') => void
  ruleLeaveType: string
  setRuleLeaveType: (type: string) => void
  ruleMaxDays: string
  setRuleMaxDays: (days: string) => void
  ruleCarryForward: string
  setRuleCarryForward: (val: string) => void
  ruleAccrualRate: string
  setRuleAccrualRate: (val: string) => void
  ruleAccrualFreq: string
  setRuleAccrualFreq: (freq: string) => void
  ruleIsPaid: boolean
  setRuleIsPaid: (isPaid: boolean) => void
  ruleDescription: string
  setRuleDescription: (desc: string) => void
  rulePayName: string
  setRulePayName: (name: string) => void
  rulePayCategory: 'Allowance' | 'Deduction'
  setRulePayCategory: (cat: 'Allowance' | 'Deduction') => void
  rulePayTrigger: string
  setRulePayTrigger: (trigger: string) => void
  rulePayCalcType: 'Fixed Amount' | 'Percentage (%)'
  setRulePayCalcType: (calcType: 'Fixed Amount' | 'Percentage (%)') => void
  rulePayValue: string
  setRulePayValue: (val: string) => void
  rulePayBase: string
  setRulePayBase: (base: string) => void
  rulePayApplyAutomatically: boolean
  setRulePayApplyAutomatically: (val: boolean) => void
  handleSaveLeaveRule: (e: React.FormEvent) => void
  handleSavePayrollRule: (e: React.FormEvent) => void
}

export function useRulesWizardDialog({
  open,
  onOpenChange,
  leaveTypes,
  ruleEditIndex,
  leavePayrollRules,
  onSaveRule,
}: UseRulesWizardDialogProps): UseRulesWizardDialogReturn {
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

  return {
    rulesWizardStep,
    setRulesWizardStep,
    ruleLeaveType,
    setRuleLeaveType,
    ruleMaxDays,
    setRuleMaxDays,
    ruleCarryForward,
    setRuleCarryForward,
    ruleAccrualRate,
    setRuleAccrualRate,
    ruleAccrualFreq,
    setRuleAccrualFreq,
    ruleIsPaid,
    setRuleIsPaid,
    ruleDescription,
    setRuleDescription,
    rulePayName,
    setRulePayName,
    rulePayCategory,
    setRulePayCategory,
    rulePayTrigger,
    setRulePayTrigger,
    rulePayCalcType,
    setRulePayCalcType,
    rulePayValue,
    setRulePayValue,
    rulePayBase,
    setRulePayBase,
    rulePayApplyAutomatically,
    setRulePayApplyAutomatically,
    handleSaveLeaveRule,
    handleSavePayrollRule,
  }
}
