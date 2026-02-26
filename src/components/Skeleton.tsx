"use client";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "chart" | "circle";
}

export default function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const baseClass = "skeleton-shimmer";
  
  const variantClasses = {
    card: "w-full h-full rounded-2xl",
    text: "h-4 rounded-md",
    chart: "w-full h-[240px] rounded-xl",
    circle: "rounded-full",
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton variant="circle" className="w-8 h-8" />
        <div className="flex-1">
          <Skeleton className="w-24 mb-2" />
          <Skeleton className="w-32 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-[60px] rounded-xl mb-3" />
      <Skeleton className="w-20 h-8" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-5">
      <div className="mb-5">
        <Skeleton className="w-32 mb-2" />
        <Skeleton className="w-48 h-3" />
      </div>
      <Skeleton variant="chart" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card p-5">
      <Skeleton className="w-24 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="flex-1" />
            <Skeleton className="w-16" />
            <Skeleton className="w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
