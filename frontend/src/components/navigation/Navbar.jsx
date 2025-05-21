import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Button, Group, Drawer } from "@mantine/core";
import { IconShoppingBag, IconUser } from "@tabler/icons-react";
import classes from './HeaderMenu.module.css';
import './Navbar.scss';

import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Cart from "../cart/Cart.jsx";


const links = [
  { link: '/products', label: 'PRODUCTS' },
  { link: '/about', label: 'ABOUT US' },
  { link: '/workshop', label: 'WORKSHOP', admin: true },
  { link: '/workshop/orders', label: 'ORDERS', admin: true },
]

function Navbar() {
  const { currentUser, isAdminUser, logout } = useAuth();
  const { cartCount } = useCart();
  const [opened, { open, close }] = useDisclosure(false);

  const logoutButton = <Button variant="outline" color="red" onClick={logout}>Logout</Button>;
  const loginButton = <Link to="/login" className={classes.link + " nav-link login-button"}><IconUser size={18} className="margin-right"/> LOGIN</Link>;

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
        <div className="flex row nav-link">
          {link.icon} {link.label}
        </div>
      </Link>
    );
  });

  const cartButton = (
    <button className={classes.link + " nav-link cart-button"} onClick={open}>
      <IconShoppingBag size={20} className="margin-right" />
      CART {cartCount > 0 && <span className="cart-count margin-left">{cartCount}</span>}
    </button>
  );

  return (
    <div>
      <header className={classes.header}>
        <div className="navbar">
          <div className={classes.inner}>
            <Link to="/" className="header-logo">
              Sustainable Woodworks
            </Link>
            <Group gap={5} visibleFrom="sm">
              {items}
              {cartButton}
              {loginLogoutButton}
            </Group>
          </div>
        </div>
      </header>

      <Drawer opened={opened} onClose={close} position="right" size="md">
        <Cart close={close} />
      </Drawer>
    </div>
  );
}

export default Navbar;