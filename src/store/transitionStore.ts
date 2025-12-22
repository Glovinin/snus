import { create } from 'zustand';
import { Product } from '@/lib/firebase/products';

interface TransitionState {
    transitionProduct: Product | null;
    transitionSourceId: string | null;
    setTransitionProduct: (product: Product | null, sourceId?: string) => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
    transitionProduct: null,
    transitionSourceId: null,
    setTransitionProduct: (product, sourceId) => set({ transitionProduct: product, transitionSourceId: sourceId || null }),
}));
