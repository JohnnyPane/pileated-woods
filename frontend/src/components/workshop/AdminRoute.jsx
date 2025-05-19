import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Unauthorized from "../auth/Unauthorized.jsx";
import { AdminRouteProvider } from "../../context/AdminRouteContext.jsx";

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

  return <AdminRouteProvider>{element}</AdminRouteProvider>;
};

export default AdminRoute;