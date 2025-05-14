import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import './App.css';
import './utility.scss'
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Navbar from './components/navigation/Navbar';
import LoginSignup from './components/auth/LoginSignup';
import ProductWorkshop from "./components/workshop/ProductWorkshop.jsx";
import Unauthorized from "./components/auth/Unauthorized.jsx";
import Workshop from "./components/workshop/Workshop.jsx";


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
        <Navbar />
        <main className="main-container">
          <div className="main-container-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/login" element={<LoginSignup />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="workshop/products/:id" element={<AdminRoute element={<ProductWorkshop />} />} />
              <Route path="workshop" element={<AdminRoute element={<Workshop />} />} />
            </Routes>
          </div>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
