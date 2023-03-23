import {create} from 'zustand';

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  store_id: number;
  promocode_id: string;
  order_total: number;
  discount_amount: number;
  status: string;
  note: string;
  product_detail: Product[];
  created_at: string;
  accepted_at: string;
  canceled_at: string;
  processing_at: string;
  finished_at: string;
  updated_at: string;
  taken_at: string;
  cancel_reason: string;
  product_count: number;
  user: {
    id: number;
    f_name: string;
    phone: string;
    status: string;
    mssv: string;
  };
  store: {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    status: string;
    email: string;
    selling_products: string;
    location: string;
    image: string;
    deny_reason: string;
    wallet_balance: number;
    cover_photo: string;
  };
}

export interface AddOns {
  id: number;
  name: string;
  price: number;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  add_ons: AddOns[];
  total_price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  user_id: number;
  product_id: number;
  store_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface myCart {
  products: Product[];
  total_quantity: number;
  total_price: string;
}

export interface HistoryOrder {
  orders: myOrder[];
}

export interface myOrder {
  id: number;
  order_code: string;
  user_id: number;
  store_id: number;
  promocode_id: number;
  order_total: number;
  discount_amount: number;
  status: string;
  note: string;
  created_at: string;
  accepted_at: string;
  canceled_at: string;
  processing_at: string;
  finished_at: string;
  updated_at: string;
  taken_at: string;
  cancel_reason: string;
  product_quantity: number;
  product_detail: Product[];
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
