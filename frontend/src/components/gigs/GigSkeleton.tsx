export function GigSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 border-b border-border animate-pulse">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>
      </div>
      <div className="h-5 w-20 bg-muted rounded" />
    </div>
  );
}
