import PileatedApi from "./PileatedApi.js";

const cartApi = new PileatedApi('cart');
const guestCartApi = new PileatedApi('guest_cart');

export default class CartService {
  getGuestToken() {
    return localStorage.getItem('guestToken');
  }

  guestTokenExists() {
    return !!localStorage.getItem('guestToken');
  }

  getCartItems() {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems && cartItems !== 'undefined') {
      return JSON.parse(cartItems);
    } else {
      return [];
    }
  }

  saveCartItems(cartItems) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  async initializeCart() {
    const guestToken = localStorage.getItem('guestToken');

    if (!guestToken || guestToken === 'undefined') {
      try {
        const response = await guestCartApi.create('new')
        const { guest_token } = response;

        localStorage.setItem('guestToken', guest_token);
        localStorage.setItem('cartItems', JSON.stringify([]));

        return guest_token;
      } catch (error) {
        console.error("Error initializing guest cart:", error);
        localStorage.setItem('cartItems', JSON.stringify([]));
      }
    } else {
      try {
        const response = await guestCartApi.get(guestToken);
        const { cartItems } = response;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error fetching guest cart:", error);
      }
    }

    return guestToken;
  }

  async addToCart(product, quantity = 1) {
    let cartItems;
    const existingCartItems = this.getCartItems();
    const existingItem = existingCartItems.find(item => item.product_id === product.id);
    const previousQuantity = existingItem ? existingItem.quantity : 0;

    try {
      const guestToken = this.getGuestToken();
      if (guestToken) {
        const updatedCart = await guestCartApi.postMemberRoute(guestToken, 'add_to_cart', {
          product_id: product.id,
          quantity: previousQuantity + quantity,
        });
        cartItems = updatedCart.cart_items;
        this.saveCartItems(cartItems);
      } else {
        await this.initializeCart();
        return this.addToCart(product, quantity);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }

    return cartItems
  }

  async removeFromCart(itemId) {
    const cartItems = this.getCartItems();
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);

    this.saveCartItems(updatedCartItems);

    try {
      const guestToken = this.getGuestToken();
      if (guestToken) {
        await guestCartApi.postMemberRoute(guestToken, 'remove_from_cart', {
          cart_item_id: itemId,
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }

    return updatedCartItems;
  }

  async fetchCartFromServer() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.id) {
      return this.fetchUserCart(user);
    } else {
      return this.fetchGuestCart();
    }
  }

  async fetchUserCart(user) {
    try {
      const response = await cartApi.get(user.id);
      const { cart_items } = response;
      this.saveCartItems(cart_items);
      return response;
    } catch (error) {
      console.error("Error fetching user cart:", error);
      throw error;
    }
  }

  async fetchGuestCart() {
    const guestToken = this.getGuestToken();

    if (!guestToken) {
      return null;
    }

    try {
      const response = await guestCartApi.get(guestToken);
      const { cart_items } = response;
      this.saveCartItems(cart_items);
      return response;
    } catch (error) {
      console.error("Error fetching cart from server:", error);
      throw error;
    }
  }

  async updateQuantity(itemId, quantity) {
    const cartItems = this.getCartItems();
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.saveCartItems(updatedCartItems);

    try {
      const guestToken = this.getGuestToken();
      if (guestToken) {
        await guestCartApi.postMemberRoute(guestToken, 'update_quantity', {
          cart_item_id: itemId,
          quantity,
        });
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }

    return updatedCartItems;
  }

  async clearCart() {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('guestToken');
  }

  cartTotal() {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  prepareCartForLogin() {
    return {
      guestToken: this.getGuestToken(),
    };
  }

  async updateCartOnLogin() {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await cartApi.get(user.id);
      const { cartItems } = response;
      this.saveCartItems(cartItems);
      return cartItems;
    } catch (error) {
      console.error("Error updating cart on login:", error);
      throw error;
    }
  }
}