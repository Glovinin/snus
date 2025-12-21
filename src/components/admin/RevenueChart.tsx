"use client";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar
} from "recharts";

const data = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2300 },
    { name: "Mar", total: 3200 },
    { name: "Apr", total: 2900 },
    { name: "May", total: 4500 },
    { name: "Jun", total: 5100 },
    { name: "Jul", total: 4800 },
    { name: "Aug", total: 5600 },
    { name: "Sep", total: 6200 },
    { name: "Oct", total: 7800 },
    { name: "Nov", total: 8500 },
    { name: "Dec", total: 9200 },
];

export function RevenueChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#a1a1aa"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#a1a1aa"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                    cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const productData = [
    { name: "Siberia Red", sales: 4000 },
    { name: "General Snus", sales: 3000 },
    { name: "VELO Ice", sales: 2000 },
    { name: "ZYN Citrus", sales: 2780 },
    { name: "Oden's", sales: 1890 },
];

export function TopProductsChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#a1a1aa"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={32} />
            </BarChart>
        </ResponsiveContainer>
    );
}

