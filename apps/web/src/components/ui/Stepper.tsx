import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className="flex flex-col items-center relative flex-1">
            {index !== 0 && (
              <div 
                className={`absolute left-0 top-3 -translate-x-1/2 -translate-y-1/2 h-0.5 w-[calc(100%-2rem)] ${
                  isCompleted ? 'bg-primary' : 'bg-border'
                }`} 
              />
            )}
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                isActive 
                  ? 'bg-primary text-primary-foreground border-2 border-primary ring-4 ring-primary/10' 
                  : isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border-2 border-border text-muted'
              }`}
            >
              {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
            </div>
            <span className={`mt-3 text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted'}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
