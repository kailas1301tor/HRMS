// components/settings/leave-payroll-rules.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import { RulesWizardDialog } from './rules/rules-wizard-dialog'

export interface LeaveRule {
  id: string
  type: 'leave'
  leaveType: string
  maxDays: string
  carryForwardLimit: string
  accrualRate: string
  accrualFrequency: string
  isPaid: boolean
  description: string
}

export interface PayrollRule {
  id: string
  type: 'payroll'
  name: string
  category: 'Allowance' | 'Deduction'
  triggerBasis: string
  calculationType: 'Fixed Amount' | 'Percentage (%)'
  value: string
  baseIfPercentage: string
  applyAutomatically: boolean
}

export type Rule = LeaveRule | PayrollRule

interface LeavePayrollRulesProps {
  leaveTypes: string[]
  leavePayrollRules: Rule[]
  setLeavePayrollRules: (rules: Rule[]) => void
}

export function LeavePayrollRules({
  leaveTypes,
  leavePayrollRules,
  setLeavePayrollRules,
}: LeavePayrollRulesProps) {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false)
  const [ruleEditIndex, setRuleEditIndex] = useState<number | null>(null)

  const handleOpenConfigureRules = () => {
    setRuleEditIndex(null)
    setIsRulesModalOpen(true)
  }

  const handleOpenEditRule = (index: number) => {
    setRuleEditIndex(index)
    setIsRulesModalOpen(true)
  }

  const handleSaveRule = (index: number | null, rule: Rule) => {
    if (index !== null) {
      const updated = [...leavePayrollRules]
      updated[index] = rule
      setLeavePayrollRules(updated)
    } else {
      setLeavePayrollRules([...leavePayrollRules, rule])
    }
  }

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Leave & Payroll Rules Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Configure company-wide policies for leave tracking and salary components</p>
      </div>

      <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base text-cloud font-semibold">Active Policies & Rules</CardTitle>
          </div>
          <Button
            onClick={handleOpenConfigureRules}
            className="bg-primary hover:bg-primary/95 text-white font-semibold cursor-pointer shadow-lg shadow-primary/20"
          >
            Configure Rules
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {leavePayrollRules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">
                  {rule.type === 'leave' ? `${rule.leaveType} Policy` : rule.name}
                </span>
                <span className="text-xs text-slate-400">
                  {rule.type === 'leave'
                    ? `${rule.maxDays} Days Max | ${rule.isPaid ? 'Paid' : 'Unpaid'}`
                    : `${rule.category} | ${rule.calculationType} (${rule.value}${rule.calculationType === 'Percentage (%)' ? '% of ' + rule.baseIfPercentage : ''})`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                  onClick={() => handleOpenEditRule(index)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                  onClick={() => setLeavePayrollRules(leavePayrollRules.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <RulesWizardDialog
        open={isRulesModalOpen}
        onOpenChange={setIsRulesModalOpen}
        leaveTypes={leaveTypes}
        ruleEditIndex={ruleEditIndex}
        leavePayrollRules={leavePayrollRules}
        onSaveRule={handleSaveRule}
      />
    </div>
  )
}
