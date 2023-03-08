import create from 'zustand';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  totalItems: number;
};

export const useCart = create<CartState>(set => ({
  items: [],
  addToCart: product =>
    set(state => {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id,
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity++;
        return {
          items: updatedItems,
          totalItems: state.totalItems + 1,
        };
      } else {
        return {
          items: [...state.items, {product, quantity: 1}],
          totalItems: state.totalItems + 1,
        };
      }
    }),
  removeFromCart: productId =>
    set(state => {
      const filteredItems = state.items.filter(
        item => item.product.id !== productId,
      );
      return {
        items: filteredItems,
        totalItems: state.totalItems - 1,
      };
    }),
  increaseQuantity: productId =>
    set(state => {
      const updatedItems = [...state.items];
      const itemIndex = updatedItems.findIndex(
        item => item.product.id === productId,
      );
      updatedItems[itemIndex].quantity++;
      return {
        items: updatedItems,
        totalItems: state.totalItems + 1,
      };
    }),
  decreaseQuantity: productId =>
    set(state => {
      const updatedItems = [...state.items];
      const itemIndex = updatedItems.findIndex(
        item => item.product.id === productId,
      );
      updatedItems[itemIndex].quantity--;
      if (updatedItems[itemIndex].quantity === 0) {
        updatedItems.splice(itemIndex, 1);
      }
      return {
        items: updatedItems,
        totalItems: state.totalItems - 1,
      };
    }),
  totalItems: 0,
}));
