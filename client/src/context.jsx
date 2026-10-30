import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken } from './api.js';

const Ctx = createContext();
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);

  const loadCart = useCallback(async () => {
    try { setCart(await api('/cart')); } catch { setCart([]); }
  }, []);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        try { setUser(await api('/auth/me')); await loadCart(); } catch { setToken(null); }
      }
      setReady(true);
    })();
  }, [loadCart]);

  const login = async (path, body) => {
    const d = await api(path, { method: 'POST', body });
    setToken(d.token); setUser(d.user); await loadCart();
  };
  const logout = () => { setToken(null); setUser(null); setCart([]); };
  const cartOp = async (method, path, body) => setCart(await api(path, { method, body }));
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ user, setUser, cart, setCart, ready, login, logout, cartOp, count }}>{children}</Ctx.Provider>;
}
