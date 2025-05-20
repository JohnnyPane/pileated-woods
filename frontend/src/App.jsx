import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import './App.css';
import './utility.scss'
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import AdminRoute from "./components/workshop/AdminRoute.jsx";
import Home from './components/home/Home';
import ProductList from './components/products/ProductList';
import ProductShow from './components/products/ProductShow.jsx';
import Navbar from './components/navigation/Navbar';
import LoginSignup from './components/auth/LoginSignup';
import ProductWorkshop from "./components/workshop/ProductWorkshop.jsx";
import Workshop from "./components/workshop/Workshop.jsx";
import StripeProvider from "./components/StripeProvider.jsx";
import Checkout from "./components/cart/Checkout.jsx";
import Cart from "./components/cart/Cart.jsx";
import AuthWrapper from "./components/auth/AuthWrapper.jsx";
import Order from "./components/orders/Order.jsx";
import Orders from "./components/workshop/Orders.jsx";


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AuthWrapper>
            <Navbar />
            <main className="main-container">
              <div className="main-container-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginSignup />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:id" element={<ProductShow />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={
                    <StripeProvider>
                      <Checkout />
                    </StripeProvider>
                  } />

                  <Route path="/orders/:orderId" element={<Order />} />

                  <Route path="workshop" element={<AdminRoute element={<Workshop />} />} />
                  <Route path="workshop/products/:id" element={<AdminRoute element={<ProductWorkshop />} />} />
                  <Route path="workshop/orders" element={<AdminRoute element={<Orders />} />} />
                </Routes>
              </div>
            </main>
          </AuthWrapper>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
