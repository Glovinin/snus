"use client";

import { Bell, Search, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40 ml-64">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search orders, products, customers..."
                        className="w-full h-10 bg-zinc-900/50 border border-white/5 rounded-full pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 focus:border-indigo-500/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                    <Bell className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
                        <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
