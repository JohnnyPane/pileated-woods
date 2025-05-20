import { useNavigate } from "react-router-dom";
import useCart from "../../context/CartContext";
import { Button, Divider } from '@mantine/core';
import CartItem from "./CartItem.jsx";
import CartSummary from "./CartSummary.jsx";
import './Cart.scss';

const Cart = ({ close = () => null, checkout = false }) => {
  const { cart, loading, addToCart, removeFromCart, cartTotalDisplay } = useCart();

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const { items } = cart;


  const handleGoToCheckout = () => {
    close();
    navigate('/checkout');
  }

  const goToCheckout = () => {
    return (
      <div className="flex column margin-t-80">
        <span className="label-small margin-bottom">Shipping & taxes calculated at checkout</span>
        <Button onClick={handleGoToCheckout} radius={0} className="full-width">
          <span className="margin-right">Go to Checkout</span>
          <span className="margin-right margin-left">|</span>
          <span className="margin-left">{cartTotalDisplay}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="double-padding">
      {items.map(cartItem => (
        <div key={cartItem.id}>

          <CartItem item={cartItem} onRemove={removeFromCart} addToCart={addToCart} close={close}/>

          <Divider my="sm"/>
        </div>
      ))}

      {checkout ? (<CartSummary />) : (goToCheckout())}
    </div>
  );
}

export default Cart;