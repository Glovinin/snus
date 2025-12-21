"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { RevenueChart, TopProductsChart } from "@/components/admin/RevenueChart";
import { DollarSign, ShoppingBag, Eye, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Analytics"
                description="Detailed insights into store performance."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Sales"
                    value="$124,592.00"
                    change="+12.5%"
                    isPositive={true}
                    icon={DollarSign}
                />
                <MetricCard
                    title="Online Store Sessions"
                    value="45,231"
                    change="+2.4%"
                    isPositive={true}
                    icon={Eye}
                />
                <MetricCard
                    title="Conversion Rate"
                    value="3.24%"
                    change="-0.1%"
                    isPositive={false}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Orders"
                    value="1,245"
                    change="+15.3%"
                    isPositive={true}
                    icon={ShoppingBag}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-2 bg-zinc-900/50 border border-white/5 rounded-xl p-6 h-[400px]">
                    <h3 className="font-semibold text-white mb-6">Total Sales Over Time</h3>
                    <div className="h-[320px] w-full">
                        <RevenueChart />
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 h-[400px]">
                    <h3 className="font-semibold text-white mb-2">Top Selling Products</h3>
                    <div className="h-[340px] w-full">
                        <TopProductsChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
