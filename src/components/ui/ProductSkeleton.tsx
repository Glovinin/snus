import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
    return (
        <div className="w-full h-[380px] sm:h-[420px] rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 flex flex-col">
            <div className="p-5 flex justify-between">
                <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
            </div>
            <div className="flex-1" />
            <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-32 bg-white/10" />
                <Skeleton className="h-8 w-3/4 bg-white/10" />
                <Skeleton className="h-6 w-24 bg-white/10" />
            </div>
        </div>
    );
}

export function ShopGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
