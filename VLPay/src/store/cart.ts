import {create} from 'zustand';
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: Product, quantity: number) => void;
  totalItems: number;
  clearCart: () => void;
  totalPrice: () => number;
  incrementCartItem: (productId: number) => void;
  decrementCartItem: (productId: number) => void;
}

const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  addToCart: (item, quantity) =>
    set(state => {
      // Check if the product is already in the cart
      const itemIndex = state.cartItems.findIndex(
        cartItem => cartItem.product.id === item.id,
      );

      if (itemIndex !== -1) {
        // If the product is already in the cart, increment its quantity
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[itemIndex].quantity += quantity;
        return {
          cartItems: updatedCartItems,
          totalItems: state.totalItems + quantity,
        };
      } else {
        // If the product is not in the cart, add it as a new item
        return {
          cartItems: [...state.cartItems, {product: item, quantity: quantity}],
          totalItems: state.totalItems + quantity,
        };
      }
    }),
  totalItems: 0,
  clearCart: () => set({cartItems: [], totalItems: 0}),
  totalPrice: () =>
    get().cartItems.reduce(
      (total, product) => total + product.product.price * product.quantity,
      0,
    ),
  incrementCartItem: (productId: number) => {
    const cartItem = get().cartItems.find(
      item => item.product.id === productId,
    );

    if (cartItem) {
      cartItem.quantity += 1;
      set({cartItems: get().cartItems, totalItems: get().totalItems + 1});
    }
  },
  decrementCartItem: (productId: number) => {
    const cartItem = get().cartItems.find(
      item => item.product.id === productId,
    );

    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        set({cartItems: get().cartItems, totalItems: get().totalItems - 1});
      } else {
        // remove cart item
        set({
          cartItems: get().cartItems.filter(
            item => item.product.id !== productId,
          ),
          totalItems: get().totalItems - 1,
        });
      }
    }
  },
}));

export default useCartStore;
