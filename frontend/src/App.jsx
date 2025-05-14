import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Navbar from './components/navigation/Navbar';
import LoginSignup from './components/auth/LoginSignup';

import './App.css';
import './utility.scss'

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return navigate('/');
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
