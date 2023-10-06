import React from "react";
export function PaymentFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 space-y-4 p-4">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-11/12" />
      </div>
      <div className="flex items-center space-x-8">
        <Skeleton className="h-24 w-1/3" />
        <Skeleton className="h-24 w-1/3" />
        <Skeleton className="h-24 w-1/3" />
      </div>
      <div className="pb-0" />
      <Skeleton className="mb-2 h-7 w-11/12" />

      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-12 w-1/4" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

function Skeleton({ className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`animate-pulse rounded-md bg-slate-100 ${className}`} />
  );
}
