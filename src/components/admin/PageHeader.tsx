"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    children?: ReactNode;
}

export function PageHeader({
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    children
}: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                {description && (
                    <p className="text-sm text-zinc-400 mt-1">{description}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                {children}
                {actionLabel && (actionHref || onAction) && (
                    actionHref ? (
                        <Link href={actionHref}>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white border-0">
                                <Plus className="w-4 h-4 mr-2" />
                                {actionLabel}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white border-0"
                            onClick={onAction}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {actionLabel}
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}
