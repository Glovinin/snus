"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    BarChart3,
    Package,
    LogOut,
    Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const sidebarItems = [
    {
        title: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: Package
    },
    {
        title: "Customers",
        href: "/admin/customers",
        icon: Users
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings
    }
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    return (
        <div className="w-64 h-screen bg-zinc-950 border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-white/5">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="font-bold text-white text-lg">S</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-sm leading-none">SnusIdea</h1>
                        <span className="text-xs text-zinc-500">Admin Portal</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-white"
                            )} />
                            {item.title}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-white/5 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                    <Store className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                    View Store
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-3 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/20"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
