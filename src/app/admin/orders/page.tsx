"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
// Badge component not available - using custom StatusBadge below
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const orders = [
    {
        id: "ORD-001",
        date: "2024-03-15",
        customer: "John Doe",
        email: "john@example.com",
        status: "delivered",
        total: "$120.00",
        items: 3
    },
    {
        id: "ORD-002",
        date: "2024-03-14",
        customer: "Jane Smith",
        email: "jane@example.com",
        status: "processing",
        total: "$54.50",
        items: 1
    },
    {
        id: "ORD-003",
        date: "2024-03-14",
        customer: "Mike Johnson",
        email: "mike@example.com",
        status: "pending",
        total: "$210.25",
        items: 5
    },
    {
        id: "ORD-004",
        date: "2024-03-12",
        customer: "Sarah Williams",
        email: "sarah@example.com",
        status: "cancelled",
        total: "$45.00",
        items: 2
    }
];

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        shipped: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const style = styles[status as keyof typeof styles] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} capitalize`}>
            {status}
        </span>
    );
}

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Orders"
                description="Manage and fulfill store orders."
            // actionLabel="Create Order"
            // actionHref="/admin/orders/new"
            />

            <AdminTable headers={["Order", "Date", "Customer", "Status", "Total", "Items", "Actions"]}>
                {orders.map((order) => (
                    <AdminTableRow key={order.id}>
                        <AdminTableCell className="font-medium text-white">{order.id}</AdminTableCell>
                        <AdminTableCell>{new Date(order.date).toLocaleDateString()}</AdminTableCell>
                        <AdminTableCell>
                            <div>
                                <div className="text-white">{order.customer}</div>
                                <div className="text-xs text-zinc-500">{order.email}</div>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>
                            <StatusBadge status={order.status} />
                        </AdminTableCell>
                        <AdminTableCell>{order.total}</AdminTableCell>
                        <AdminTableCell>{order.items} items</AdminTableCell>
                        <AdminTableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-zinc-400">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTable>
        </div>
    );
}
