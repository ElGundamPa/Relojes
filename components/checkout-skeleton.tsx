"use client";

export function CheckoutSkeleton() {
  return (
    <div className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-8 bg-muted rounded mb-6 w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-8 bg-muted rounded mb-6 w-1/2"></div>
              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

