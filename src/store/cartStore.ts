import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
    bgClass: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string, variant: string) => void;
    updateQuantity: (id: string, variant: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubtotal: () => number;

    // UI State
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            addItem: (item) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.id === item.id && i.variant === item.variant
                    );

                    if (existingItemIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += item.quantity || 1;
                        return { items: newItems };
                    }

                    return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
                });
            },

            removeItem: (id, variant) => {
                set((state) => ({
                    items: state.items.filter((i) => !(i.id === id && i.variant === variant)),
                }));
            },

            updateQuantity: (id, variant, quantity) => {
                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.id === id && item.variant === variant) {
                            return { ...item, quantity: Math.max(0, quantity) };
                        }
                        return item;
                    }).filter((item) => item.quantity > 0), // Remove items with 0 quantity
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            // UI Actions
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
        }),
        {
            name: 'snus-cart-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            // Only persist items, not the UI state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
