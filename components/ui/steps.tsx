import * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Steps({ className, children, ...props }: StepsProps) {
  const childrenArray = React.Children.toArray(children)
  const steps = childrenArray.map((step, index) => {
    if (React.isValidElement(step)) {
      return React.cloneElement(step, {
        stepNumber: index + 1,
      })
    }
    return step
  })

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {steps}
    </div>
  )
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  stepNumber?: number
  children: React.ReactNode
}

export function Step({ title, stepNumber, children, className, ...props }: StepProps) {
  return (
    <div className={cn("flex gap-3", className)} {...props}>
      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white text-sm font-medium">
        {stepNumber}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">{title}</h3>
        <div className="text-sm text-gray-400">{children}</div>
      </div>
    </div>
  )
}
