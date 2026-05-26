"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PlanSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Day cards */}
      {[0, 1, 2].map((day) => (
        <div key={day} className="space-y-3 rounded-xl border border-border/40 p-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-40" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((act) => (
              <div key={act} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-3 w-12" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 border-t border-border/20 pt-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
