import { Link } from 'react-router-dom';
import { Button, Group } from "@mantine/core";
import classes from './HeaderMenu.module.css';
import './Navbar.scss';

import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const links = [
  { link: '/products', label: 'PRODUCTS' },
  { link: '/workshop', label: 'WORKSHOP', admin: true },
  { link: '/cart', label: 'CART' },
]

function Navbar() {
  const { currentUser, isAdminUser, logout } = useAuth();
  const { clearCart } = useCart();

  const logoutButton = <Button variant="outline" color="red" onClick={logout}>Logout</Button>;
  const loginButton = <Link to="/login" className="margin-left">Login</Link>;

  const loginLogoutButton = currentUser ? logoutButton : loginButton;

  const items = links.map((link) => {
    if (link.admin && !isAdminUser) {
      return null;
    }

    return (
      <Link
        key={link.label}
        to={link.link}
        className={classes.link}
      >
        {link.label}
      </Link>
    );
  });

  return (
    // <nav className="navbar">
    //   <div className="flex-container flex-row space-between full-width">
    //     <Link to="/" className="">Sustainable Woodworks</Link>
    //     <Button onClick={() => clearCart()} className="margin-left" variant="outline" color="blue">Clear Cart</Button>
    //     <Link to="/cart" className="margin-left">Cart</Link>
    //     {isAdminUser && workshopButton}
    //     <div className="margin">
    //       <Link to="/" className="margin-right">Products</Link>
    //       {currentUser ? logoutButton : loginButton}
    //     </div>
    //   </div>
    // </nav>

    <div>
      <header className={classes.header}>
        <div className="navbar">
          <div className={classes.inner}>
            <Link to="/" className="header-logo">
              Sustainable Woodworks
            </Link>
            <Group gap={5} visibleFrom="sm">
              {items}
            </Group>
            {loginLogoutButton}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;