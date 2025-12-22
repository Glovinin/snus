"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function SiteHeader() {
    const pathname = usePathname();

    // Do not show main header on admin or checkout pages
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) {
        return null;
    }

    return <Header />;
}
