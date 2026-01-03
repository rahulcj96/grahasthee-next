import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set, get) => ({
            // Global UI State
            isCartOpen: false,
            setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

            // Cart State
            cart: [],
            addToCart: (product, quantity = 1) => {
                const currentCart = get().cart;
                const existingItemIndex = currentCart.findIndex((item) => item.id === product.id);

                if (existingItemIndex > -1) {
                    const updatedCart = [ ...currentCart ];
                    updatedCart[ existingItemIndex ].quantity += quantity;
                    set({ cart: updatedCart });
                } else {
                    set({ cart: [ ...currentCart, { ...product, quantity } ] });
                }
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },
            updateCartQuantity: (productId, quantity) => {
                const updatedCart = get().cart.map((item) =>
                    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                );
                set({ cart: updatedCart });
            },
            clearCart: () => set({ cart: [] }),

            // Wishlist State
            wishlist: [],
            toggleWishlist: (product) => {
                const currentWishlist = get().wishlist;
                const isItemInWishlist = currentWishlist.some((item) => item.id === product.id);

                if (isItemInWishlist) {
                    set({ wishlist: currentWishlist.filter((item) => item.id !== product.id) });
                } else {
                    set({ wishlist: [ ...currentWishlist, product ] });
                }
            },
            removeFromWishlist: (productId) => {
                set({ wishlist: get().wishlist.filter((item) => item.id !== productId) });
            },
        }),
        {
            name: 'grahasthee-storage', // name of the item in the storage (must be unique)
        }
    )
);
