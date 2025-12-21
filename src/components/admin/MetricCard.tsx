
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon?: React.ElementType;
}

export function MetricCard({ title, value, change, isPositive, icon: Icon }: MetricCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-zinc-400">{title}</p>
                {Icon && <Icon className="w-5 h-5 text-zinc-500" />}
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1",
                    isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                )}>
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {change}
                </span>
                <span className="text-xs text-zinc-500">vs last month</span>
            </div>
        </div>
    );
}
