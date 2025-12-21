"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <Link href="/admin/products" className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Add Product</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                        Discard
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                        Save Product
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-white">General Information</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Product Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="e.g. Siberia Red"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Description</label>
                                <textarea
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[150px]"
                                    placeholder="Product description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-white">Media</h2>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-zinc-400" />
                            </div>
                            <p className="text-sm text-zinc-300 font-medium">Click to upload image</p>
                            <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-white">Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Price</label>
                                <input
                                    type="number"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Compare at price</label>
                                <input
                                    type="number"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Status */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-white">Status</h2>
                        <select className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 transition-all">
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-white">Organization</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Category</label>
                                <select className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 transition-all">
                                    <option value="">Select Category</option>
                                    <option value="nicotine_pouches">Nicotine Pouches</option>
                                    <option value="chewing_bags">Chewing Bags</option>
                                    <option value="nicotine_free">Nicotine Free</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Product Type</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="e.g. Slim Portion"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-white">Inventory</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">SKU (Stock Keeping Unit)</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="e.g. SIB-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
