export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-black/5 bg-white p-4">
      <div className="aspect-square w-full rounded-2xl bg-gray-100" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="h-10 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="aspect-square w-full rounded-3xl bg-gray-100" />
      <div className="space-y-6">
        <div className="h-4 w-1/4 rounded bg-gray-100" />
        <div className="h-8 w-3/4 rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-5/6 rounded bg-gray-100" />
        <div className="h-10 w-1/3 rounded bg-gray-100" />
        <div className="h-12 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4">
          <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/2 rounded bg-gray-100" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
            <div className="h-3 w-1/3 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
