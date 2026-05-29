// components/requests/request-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Clock, ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Request } from './requests-constants'
import { typeConfig, statusConfig, priorityConfig } from './requests-constants'

interface RequestCardProps {
  request: Request
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
}

export function RequestCard({
  request,
  index,
  isExpanded,
  onToggleExpand,
}: RequestCardProps) {
  const type = typeConfig[request.type]
  const status = statusConfig[request.status]
  const priority = priorityConfig[request.priority]
  const TypeIcon = type.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'bg-card border border-border rounded-2xl overflow-hidden border-l-2',
        type.borderColor
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={request.requester.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {request.requester.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('p-1 rounded', type.color)}>
                <TypeIcon className="w-3 h-3" />
              </span>
              <h3 className="text-sm font-medium text-cloud truncate">{request.title}</h3>
              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', status.className)}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {request.requester.name} · {request.requester.department} ·{' '}
              <span className="font-mono text-violet-glow">{request.id}</span>
            </p>
            <p className="text-sm text-slate-400">{request.description}</p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {request.submittedAt}
            </div>
            <span className={cn('text-xs font-medium', priority.className)}>
              {priority.label} Priority
            </span>
            {request.status === 'pending' && (
              <div className="flex items-center gap-1 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-3 bg-lime-400 text-lime-900 hover:bg-lime-300"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 mt-4 text-xs text-muted-foreground hover:text-cloud transition-colors"
        >
          <span>View Timeline</span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border bg-midnight/50 p-5"
        >
          <div className="flex items-center gap-2">
            {request.timeline.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      step.status === 'completed'
                        ? 'bg-lime-400 text-lime-900'
                        : step.status === 'current'
                        ? 'bg-violet-core text-white'
                        : 'bg-slate-700 text-slate-400'
                    )}
                  >
                    {step.status === 'completed' ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="text-[10px]">{i + 1}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 text-center max-w-[80px]">
                    {step.step}
                  </p>
                  {step.date && (
                    <p className="text-[9px] text-muted-foreground">{step.date}</p>
                  )}
                </div>
                {i < request.timeline.length - 1 && (
                  <div
                    className={cn(
                      'w-12 h-0.5 mx-2',
                      step.status === 'completed' ? 'bg-lime-400' : 'bg-slate-700'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
