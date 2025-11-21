import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-8 shadow-sm transition-all",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-transparent before:opacity-60",
        "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_50%)] after:opacity-5",
        "dark:from-card dark:via-card dark:to-muted/15 dark:before:opacity-40",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          {icon && (
            <div className="mt-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm transition-all hover:bg-primary/15 hover:ring-primary/30">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex shrink-0 items-start pt-1 sm:pt-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

