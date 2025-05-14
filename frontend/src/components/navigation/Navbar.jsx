import { Link } from 'react-router-dom';
import './Navbar.scss';

import { useAuth } from "../../context/AuthContext.jsx";
import {Button} from "@mantine/core";

function Navbar() {
  const { currentUser, logout } = useAuth();

  const logoutButton = <Button variant="outline" color="red" onClick={logout}>Logout</Button>;
  const loginButton = <Link to="/login" className="margin-left">Login</Link>;

  return (
    <nav className="navbar">
      <div className="flex-container flex-row space-between full-width">
        <Link to="/" className="">Sustainable Woodworks</Link>
        <div className="margin">
          <Link to="/" className="margin-right">Products</Link>
          {currentUser ? logoutButton : loginButton}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;