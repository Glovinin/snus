"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
import { User } from "lucide-react";

// Mock Data
const customers = [
    {
        id: "cust_1",
        name: "John Doe",
        email: "john@example.com",
        location: "New York, USA",
        orders: 5,
        spent: "$450.00"
    },
    {
        id: "cust_2",
        name: "Jane Smith",
        email: "jane@example.com",
        location: "London, UK",
        orders: 2,
        spent: "$120.00"
    },
    {
        id: "cust_3",
        name: "Mike Johnson",
        email: "mike@example.com",
        location: "Berlin, Germany",
        orders: 12,
        spent: "$1,250.00"
    },
    {
        id: "cust_4",
        name: "Sarah Williams",
        email: "sarah@example.com",
        location: "Toronto, Canada",
        orders: 1,
        spent: "$45.00"
    }
];

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Customers"
                description="View and manage your customer base."
            />

            <AdminTable headers={["Name", "Location", "Orders", "Total Spent"]}>
                {customers.map((customer) => (
                    <AdminTableRow key={customer.id}>
                        <AdminTableCell className="font-medium text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-xs text-zinc-500">{customer.email}</div>
                                </div>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell>{customer.location}</AdminTableCell>
                        <AdminTableCell>{customer.orders} orders</AdminTableCell>
                        <AdminTableCell>{customer.spent}</AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTable>
        </div>
    );
}
