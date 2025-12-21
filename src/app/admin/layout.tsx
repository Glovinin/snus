"use client";

import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/firebase/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                checkRole(user.uid);
            }
        }
    }, [user, loading]);

    async function checkRole(uid: string) {
        // Double check permissions on client side layout
        // Real security is Firestore Rules + Server Actions/API checks
        try {
            const userData = await getUserData(uid);
            if (userData && userData.role === 'admin') {
                setIsAuthorized(true);
            } else {
                router.push("/");
            }
        } catch (error) {
            router.push("/");
        }
    }

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-foreground selection:bg-indigo-500/30">
            <AdminSidebar />
            <AdminHeader />
            <main className="ml-64 p-6 min-h-[calc(100vh-64px)]">
                {children}
            </main>
        </div>
    );
}
