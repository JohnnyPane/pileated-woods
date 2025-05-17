import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import './App.css';
import './utility.scss'
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import Home from './components/home/Home';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductShow.jsx';
import Navbar from './components/navigation/Navbar';
import LoginSignup from './components/auth/LoginSignup';
import ProductWorkshop from "./components/workshop/ProductWorkshop.jsx";
import Unauthorized from "./components/auth/Unauthorized.jsx";
import Workshop from "./components/workshop/Workshop.jsx";
import StripeProvider from "./components/StripeProvider.jsx";
import Checkout from "./components/cart/Checkout.jsx";
import Cart from "./components/cart/Cart.jsx";
import AuthWrapper from "./components/auth/AuthWrapper.jsx";
import Order from "./components/cart/Order.jsx";


const AdminRoute = ({ element }) => {
  const { currentUser, isAdminUser, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return navigate('/login');
  }

  if (!isAdminUser) {
    return <Unauthorized />;
  }

  return element;
};

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
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={
                    <StripeProvider>
                      <Checkout />
                    </StripeProvider>
                  } />

                  <Route path="/order/:orderId" element={<Order />} />

                  <Route path="workshop/products/:id" element={<AdminRoute element={<ProductWorkshop />} />} />
                  <Route path="workshop" element={<AdminRoute element={<Workshop />} />} />
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
