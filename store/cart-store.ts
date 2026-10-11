import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  deliveryCharges: number;
  freeDeliveryThreshold: number;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setDeliverySettings: (charges: number, threshold: number) => void;
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;

  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryCharges: () => number;
  getTotal: () => number;
  getAmountForFreeDelivery: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      deliveryCharges: 250,
      freeDeliveryThreshold: 5000,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setDeliverySettings: (charges, threshold) =>
        set({ deliveryCharges: charges, freeDeliveryThreshold: threshold }),

      addItem: (product, quantity = 1, selectedSize) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              (item.selectedSize || "") === (selectedSize || "")
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQty = Math.min(
              currentItem.quantity + quantity,
              product.stock_quantity > 0 ? product.stock_quantity : 99
            );
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQty,
            };
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(
                  quantity,
                  product.stock_quantity > 0 ? product.stock_quantity : 99
                ),
                selectedSize,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (item.selectedSize || "") === (selectedSize || "")
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedSize) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedSize);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.product.id === productId &&
              (item.selectedSize || "") === (selectedSize || "")
            ) {
              const maxStock =
                item.product.stock_quantity > 0
                  ? item.product.stock_quantity
                  : 99;
              return {
                ...item,
                quantity: Math.min(quantity, maxStock),
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getDeliveryCharges: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= get().freeDeliveryThreshold) return 0;
        return get().deliveryCharges;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal + get().getDeliveryCharges();
      },

      getAmountForFreeDelivery: () => {
        const subtotal = get().getSubtotal();
        const threshold = get().freeDeliveryThreshold;
        return Math.max(0, threshold - subtotal);
      },
    }),
    {
      name: "baharse-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        deliveryCharges: state.deliveryCharges,
        freeDeliveryThreshold: state.freeDeliveryThreshold,
      }),
    }
  )
);
