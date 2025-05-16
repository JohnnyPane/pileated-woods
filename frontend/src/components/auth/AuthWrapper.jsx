import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { updateCartAfterLogin } = useCart();

  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated && !loading) {
        await updateCartAfterLogin();
      }
    }

    handleAuthChange();
  }, [isAuthenticated, loading]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default AuthWrapper;