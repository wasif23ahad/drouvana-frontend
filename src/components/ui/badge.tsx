import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary)] text-white",
        secondary:
          "border-transparent bg-[var(--color-secondary)] text-white",
        accent:
          "border-transparent bg-[var(--color-accent)] text-white",
        destructive:
          "border-transparent bg-[var(--color-error)] text-white",
        outline: "text-[var(--color-text-main)]",
        saved: "border-transparent bg-[var(--color-status-saved)] text-white",
        applied: "border-transparent bg-[var(--color-status-applied)] text-white",
        screening: "border-transparent bg-[var(--color-status-screening)] text-white",
        interview: "border-transparent bg-[var(--color-status-interview)] text-white",
        offer: "border-transparent bg-[var(--color-status-offer)] text-white",
        rejected: "border-transparent bg-[var(--color-status-rejected)] text-white",
        withdrawn: "border-transparent bg-[var(--color-status-withdrawn)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
