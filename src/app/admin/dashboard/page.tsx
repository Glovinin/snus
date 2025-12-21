"use client";

import { MetricCard } from "@/components/admin/MetricCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
                    <p className="text-zinc-400">Overview of your store's performance.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Revenue"
                    value="$45,231.89"
                    change="+20.1%"
                    isPositive={true}
                    icon={DollarSign}
                />
                <MetricCard
                    title="Orders"
                    value="+2350"
                    change="+180.1%"
                    isPositive={true}
                    icon={ShoppingBag}
                />
                <MetricCard
                    title="Returning Rate"
                    value="12.5%"
                    change="-4.3%"
                    isPositive={false}
                    icon={Activity}
                />
                <MetricCard
                    title="Active Now"
                    value="+573"
                    change="+201"
                    isPositive={true}
                    icon={Users}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-2xl bg-zinc-900/50 border border-white/5 p-6 h-[400px]">
                    <h3 className="font-semibold text-white mb-4">Revenue Over Time</h3>
                    <div className="h-[320px] w-full">
                        <RevenueChart />
                    </div>
                </div>
                <div className="col-span-3 rounded-2xl bg-zinc-900/50 border border-white/5 p-6 h-[400px]">
                    <h3 className="font-semibold text-white mb-4">Recent Sales</h3>
                    <div className="space-y-6 overflow-y-auto h-[320px] pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                                        OM
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Olivia Martin</p>
                                        <p className="text-xs text-zinc-500">olivia.martin@email.com</p>
                                    </div>
                                </div>
                                <div className="font-medium text-white">+$1,999.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
