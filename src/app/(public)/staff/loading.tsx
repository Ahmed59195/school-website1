import { Skeleton } from "@/components/ui/skeleton"

export default function StaffLoading() {
  return (
    <div className="min-h-screen">
      {/* Page header skeleton */}
      <div className="bg-muted/30 py-12">
        <div className="container">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
      </div>

      <div className="container py-12">
        {/* Search skeleton */}
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Staff grid skeleton */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="text-center space-y-3">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <Skeleton className="h-5 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
