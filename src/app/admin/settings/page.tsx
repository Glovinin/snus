"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <PageHeader
                title="Settings"
                description="Manage your store preferences and account settings."
            />

            <div className="space-y-6">
                {/* Store Details */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-white">Store Details</h2>
                        <Button variant="outline" size="sm" className="h-8 border-white/10 text-white hover:bg-white/5 bg-transparent">
                            Edit
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Store Name</label>
                            <div className="p-2.5 bg-zinc-950/50 border border-white/10 rounded-lg text-white">
                                SnusIdea
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Contact Email</label>
                            <div className="p-2.5 bg-zinc-950/50 border border-white/10 rounded-lg text-white">
                                contact@snusidea.com
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Store Currency</label>
                            <div className="p-2.5 bg-zinc-950/50 border border-white/10 rounded-lg text-white">
                                USD ($)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                    <h2 className="font-semibold text-white">Account Security</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-950/30 rounded-lg border border-white/5">
                            <div>
                                <div className="font-medium text-white">Password</div>
                                <div className="text-sm text-zinc-500">Last changed 3 months ago</div>
                            </div>
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                                Change Password
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-zinc-950/30 rounded-lg border border-white/5">
                            <div>
                                <div className="font-medium text-white">Two-Factor Authentication</div>
                                <div className="text-sm text-zinc-500">Add an extra layer of security to your account</div>
                            </div>
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                                Enable 2FA
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
