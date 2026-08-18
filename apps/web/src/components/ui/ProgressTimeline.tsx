import React from 'react';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

export type TimelineStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface TimelineStep {
  id: string;
  label: string;
  status: TimelineStatus;
  description?: string;
}

export function ProgressTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4 relative">
          {index !== steps.length - 1 && (
            <div className="absolute left-2.5 top-6 bottom-[-24px] w-px bg-border" />
          )}
          <div className="mt-0.5 flex-shrink-0 bg-background z-10">
            {step.status === 'COMPLETED' && <CheckCircle2 className="w-5 h-5 text-primary" />}
            {step.status === 'RUNNING' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
            {step.status === 'PENDING' && <Circle className="w-5 h-5 text-muted stroke-[2]" />}
            {step.status === 'FAILED' && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className="flex-1 pb-2">
            <h4 className={`text-sm font-semibold ${step.status === 'PENDING' ? 'text-muted' : 'text-foreground'}`}>
              {step.label}
            </h4>
            {step.description && (
              <p className="text-xs text-muted mt-1">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
