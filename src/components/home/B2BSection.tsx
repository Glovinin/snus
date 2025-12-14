"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Store, Users, ShoppingCart, Zap, ShieldCheck, TrendingUp } from "lucide-react";

export function B2CSection() {
    return (
        <section className="py-24 bg-foreground text-background relative overflow-hidden" data-theme="dark">
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="md:w-1/3">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-block text-sm font-medium tracking-[0.2em] uppercase text-white/60 mb-6"
                        >
                            Marketplace B2C
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6"
                        >
                            Crie sua loja. Venda globalmente.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-white/60 font-light mb-8 leading-relaxed"
                        >
                            Plataforma marketplace estilo Amazon. Empresas criam lojas próprias e vendem diretamente aos consumidores em todo o mundo.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Button size="lg" className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90">
                                Criar Minha Loja
                            </Button>
                        </motion.div>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                icon: Store,
                                title: "Loja Personalizada",
                                description: "Crie sua própria loja com identidade única na plataforma."
                            },
                            {
                                icon: Users,
                                title: "Acesso Global",
                                description: "Venda para milhões de consumidores em todo o mundo."
                            },
                            {
                                icon: ShoppingCart,
                                title: "Gestão Completa",
                                description: "Painel completo para gerenciar produtos, pedidos e vendas."
                            },
                            {
                                icon: Zap,
                                title: "Setup Instantâneo",
                                description: "Comece a vender em minutos, sem complicações."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Segurança Total",
                                description: "Pagamentos seguros e proteção para você e seus clientes."
                            },
                            {
                                icon: TrendingUp,
                                title: "Escalabilidade",
                                description: "Cresça sem limites com nossa infraestrutura robusta."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <item.icon className="w-8 h-8 text-white mb-4" />
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-white/60">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
