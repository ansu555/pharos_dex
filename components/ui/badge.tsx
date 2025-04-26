import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#113CFC] text-white hover:bg-[#113CFC]/80 dark:bg-[#F3C623] dark:text-black dark:hover:bg-[#F3C623]/90",
        secondary:
          "border-transparent bg-[#E6EDFE] text-[#113CFC] hover:bg-[#D0E0FD] dark:bg-[#F3C623]/70 dark:text-black dark:hover:bg-[#F3C623]/60",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-[#113CFC] border-[#113CFC]/40 hover:bg-[#113CFC]/10 dark:text-[#F3C623] dark:border-[#F3C623]/40 dark:hover:bg-[#F3C623]/10",
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
