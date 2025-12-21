"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminTableProps {
    headers: string[];
    children: ReactNode;
    className?: string;
}

export function AdminTable({ headers, children, className }: AdminTableProps) {
    return (
        <div className={cn("w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50", className)}>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400">
                        <tr>
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="h-12 px-6 font-medium align-middle bg-zinc-950/50"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminTableRow({ children, className, onClick }: { children: ReactNode, className?: string, onClick?: () => void }) {
    return (
        <tr
            className={cn(
                "transition-colors hover:bg-white/5 data-[state=selected]:bg-zinc-800",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {children}
        </tr>
    );
}

export function AdminTableCell({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <td className={cn("p-6 align-middle text-zinc-300", className)}>
            {children}
        </td>
    );
}
