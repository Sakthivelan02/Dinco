import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from './context.jsx';
import { Home, Products, ProductDetail, Cart, Checkout, Account, Admin } from './pages.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

function Guard({ children, adminOnly }) {
  const { user, ready } = useApp();
  const loc = useLocation();
  if (!ready) return <p className="note">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout, count } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const search = (e) => { e.preventDefault(); nav(`/products?q=${encodeURIComponent(q)}`); };
  return (
    <>
      <div className="promo">Free delivery on orders over $50 · Easy 7-day returns</div>
      <header className="bar">
      <Link to="/" className="brand">din<span>co</span></Link>
        <form className="search" onSubmit={search}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, brands and more" aria-label="Search products" />
          <button>Search</button>
        </form>
        <nav>
          {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {user ? <><NavLink to="/account">Hi, {user.name.split(' ')[0]}</NavLink><button className="link" onClick={logout}>Log out</button></>
                : <NavLink to="/login">Log in</NavLink>}
          <NavLink to="/cart" className="cartlink">Cart{count > 0 && <b>{count}</b>}</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Guard><Checkout /></Guard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Guard><Account /></Guard>} />
          <Route path="/admin" element={<Guard adminOnly><Admin /></Guard>} />
          <Route path="*" element={<p className="note">Page not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </main>
      <footer className="foot"><div><strong>Dinco</strong><p>Everyday things, well made.</p></div>
        <div><Link to="/products">Shop all</Link><Link to="/cart">Your cart</Link><Link to="/account">Your orders</Link></div></footer>
    </>
  );
}