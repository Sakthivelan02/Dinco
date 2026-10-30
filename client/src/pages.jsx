import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { api, money } from './api.js';
import { useApp } from './context.jsx';

const fallback = (e) => {
  e.target.onerror = null;
  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' fill='%2364748b' font-size='28' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";
};

const useFetch = (path) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { setData(null); api(path).then(setData).catch((e) => setError(e.message)); }, [path]);
  return [data, error, setData];
};

// India States and Districts List for Checkout
const indianStatesAndDistricts = {
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Other State / UT": ["Other District"]
};

function Card({ p }) {
  return (
    <Link to={`/products/${p._id}`} className="card">
      <div className="thumb">
        <img src={p.image} alt={p.name} loading="lazy" onError={fallback} />
        {p.stock === 0 ? <span className="badge out">Sold out</span> : p.stock <= 12 ? <span className="badge">Few left</span> : p.featured && <span className="badge hot">Featured</span>}
      </div>
      <div className="info"><span className="cat">{p.category}</span><h3>{p.name}</h3><strong className="price">{money(p.price)}</strong></div>
    </Link>
  );
}

export function Home() {
  const [d, err] = useFetch('/products?featured=1&limit=6');
  const [cats] = useFetch('/products/categories');
  return (
    <>
      <section className="hero">
        <div><span className="eyebrow">New arrivals · 100+ products</span>
          <h1>Upgrade your <em>everyday.</em></h1><p>Headphones, home essentials and fitness gear at honest prices.</p>
          <Link className="btn big" to="/products">Shop now</Link></div>
        <div className="stage">
          <img src="/images/headphones.jpg" alt="" onError={fallback} />
          <span className="floaty f1">Free delivery over $50</span>
          <span className="floaty f2">Easy 7-day returns</span>
        </div>
      </section>
      <div className="chips">{cats?.map((c) => <Link key={c} to={`/products?category=${c}`}>{c}</Link>)}</div>
      <h2 className="sec">Featured picks</h2>
      {err && <p className="error">{err}</p>}
      <div className="grid">{d?.items.map((p) => <Card key={p._id} p={p} />)}</div>
      <div className="perks"><div><b>Free delivery</b><span>On orders over $50</span></div><div><b>Easy returns</b><span>7 days, no questions</span></div><div><b>Secure checkout</b><span>Your data stays safe</span></div></div>
    </>
  );
}

export function Products() {
  const [sp, setSp] = useSearchParams();
  const [cats] = useFetch('/products/categories');
  const [d, err] = useFetch(`/products?${sp.toString()}&limit=200`);
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); n.delete('page'); setSp(n); };
  const page = +(sp.get('page') || 1);
  return (
    <>
      <div className="filters">
        <input placeholder="Search products" defaultValue={sp.get('q') || ''} onChange={(e) => set('q', e.target.value)} />
        <select value={sp.get('category') || ''} onChange={(e) => set('category', e.target.value)}>
          <option value="">All categories</option>{cats?.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sp.get('sort') || ''} onChange={(e) => set('sort', e.target.value)}>
          <option value="">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
        </select>
        <input type="number" min="0" placeholder="Max price" value={sp.get('max') || ''} onChange={(e) => set('max', e.target.value)} />
      </div>
      {err && <p className="error">{err}</p>}
      {d && !d.items.length && <p className="note">No products match. Try clearing a filter.</p>}
      <div className="grid">{d?.items.map((p) => <Card key={p._id} p={p} />)}</div>
      {d?.pages > 1 && <div className="pager">
        <button disabled={page <= 1} onClick={() => setSp({ ...Object.fromEntries(sp), page: page - 1 })}>Previous</button>
        <span>Page {page} of {d.pages}</span>
        <button disabled={page >= d.pages} onClick={() => setSp({ ...Object.fromEntries(sp), page: page + 1 })}>Next</button></div>}
    </>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, cartOp } = useApp();
  const [p, err] = useFetch(`/products/${id}`);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  if (err) return <p className="error">{err}</p>;
  if (!p) return <p className="note">Loading…</p>;
  const add = async () => {
    if (!user) return nav('/login', { state: { from: `/products/${id}` } });
    try { await cartOp('POST', '/cart', { productId: id, qty }); setMsg('Added to cart'); } catch (e) { setMsg(e.message); }
  };
  return (
    <div className="detail">
      <img src={p.image} alt={p.name} onError={fallback} />
      <div><h1>{p.name}</h1><p className="muted">{p.category}</p><p>{p.description}</p>
        <h2>{money(p.price)}</h2>
        <p>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
        <label>Quantity <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(+e.target.value)} /></label>{' '}
        <button className="btn" disabled={!p.stock} onClick={add}>Add to cart</button>
        {msg && <p role="status">{msg} {msg === 'Added to cart' && <Link to="/cart">View cart</Link>}</p>}</div>
    </div>
  );
}

export function Cart() {
  const { user, cart, cartOp } = useApp();
  if (!user) return <p className="note"><Link to="/login">Log in</Link> to see your cart.</p>;
  if (!cart.length) return <p className="note">Your cart is empty. <Link to="/products">Find something you like</Link>.</p>;
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  return (
    <>
      <h1>Your cart</h1>
      {cart.map(({ product: p, qty }) => (
        <div className="row" key={p._id}>
          <img src={p.image} alt="" onError={fallback} /><span className="grow">{p.name}<br /><span className="muted">{money(p.price)}</span></span>
          <input type="number" min="1" max={p.stock} value={qty} aria-label={`Quantity for ${p.name}`} onChange={(e) => cartOp('PUT', `/cart/${p._id}`, { qty: +e.target.value })} />
          <strong>{money(p.price * qty)}</strong>
          <button className="link" onClick={() => cartOp('DELETE', `/cart/${p._id}`)}>Remove</button>
        </div>
      ))}
      <h2>Total: {money(total)}</h2>
      <Link className="btn" to="/checkout">Go to checkout</Link>
    </>
  );
}

export function Checkout() {
  const { cart, setCart } = useApp();
  const [f, setF] = useState({ 
    fullName: '', 
    email: '', 
    address: '', 
    state: 'Tamil Nadu', 
    city: 'Tiruchirappalli', 
    postalCode: '', 
    country: 'India', 
    card: '' 
  });
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  
  const on = (k) => (e) => {
    const val = e.target.value;
    if (k === 'state') {
      const firstDistrict = indianStatesAndDistricts[val]?.[0] || '';
      setF({ ...f, state: val, city: firstDistrict });
    } else {
      setF({ ...f, [k]: val });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { card, state, ...shippingData } = f; 
      const shipping = {
        ...shippingData,
        city: `${f.city}, ${f.state}`
      };
      const res = await api('/orders', { method: 'POST', body: { shipping } }); 
      setOrder(res); 
      setCart([]);
    } catch (x) { 
      setErr(x.message || 'Failed to place order. Please try again.'); 
    } finally {
      setLoading(false);
    }
  };

  if (order) return (
    <div className="note" style={{ textAlign: 'center', padding: '30px' }}>
      <h1 style={{ color: '#22d3ee' }}>Order confirmed!</h1>
      <p>Order {order._id} for {money(order.total)} is on its way to {order.shipping.city}.</p>
      <div style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid #22d3ee', padding: '15px', borderRadius: '12px', margin: '20px auto', maxWidth: '400px' }}>
        <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#22d3ee' }}>✉️ Email Notification Sent</p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#9aa6d1' }}>Your order confirmation message has been sent to <b>{f.email}</b>.<br /><i>"Your order is placed successfully!"</i></p>
      </div>
      <Link className="btn" to="/account">View order history</Link>
    </div>
  );

  if (!cart.length) return <p className="note">Your cart is empty. <Link to="/products">Browse products</Link></p>;
  
  const availableDistricts = indianStatesAndDistricts[f.state] || ["Other District"];

  return (
    <form className="form" onSubmit={submit}>
      <h1>Checkout</h1>
      <label>Full Name<input required value={f.fullName} onChange={on('fullName')} /></label>
      
      <label>Email Address (for order updates)
        <input type="email" required value={f.email} onChange={on('email')} placeholder="e.g. sakthi@gmail.com" />
      </label>

      <label>Street Address<input required value={f.address} onChange={on('address')} placeholder="Door No, Street Name" /></label>
      
      <label>State / Region
        <select required value={f.state} onChange={on('state')}>
          {Object.keys(indianStatesAndDistricts).map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </label>

      <label>District / City
        <select required value={f.city} onChange={on('city')}>
          {availableDistricts.map((dist) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
      </label>

      <label>Postal Code<input required value={f.postalCode} onChange={on('postalCode')} placeholder="e.g. 620001" /></label>

      <label>Country
        <select required value={f.country} onChange={on('country')}>
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Singapore">Singapore</option>
          <option value="Malaysia">Malaysia</option>
        </select>
      </label>

      <label>Card number (demo, not stored)<input required inputMode="numeric" pattern="[0-9 ]{12,19}" value={f.card} onChange={on('card')} /></label>
      <h3>Order summary</h3>
      {cart.map((i) => <p key={i.product._id}>{i.qty} × {i.product.name} <strong>{money(i.qty * i.product.price)}</strong></p>)}
      <h2>Total: {money(total)}</h2>
      {err && <p className="error" style={{ color: '#fb7185', background: 'rgba(251, 113, 133, 0.1)', padding: '10px', borderRadius: '8px' }}>⚠️ {err}</p>}
      <button className="btn" disabled={loading}>
        {loading ? 'Placing Order...' : 'Place order'}
      </button>
    </form>
  );
}

export function Auth({ mode }) {
  const { login } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await login(`/auth/${mode}`, f); nav(loc.state?.from || '/'); } catch (x) { setErr(x.message); }
  };
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form className="form" onSubmit={submit}>
      <h1>{mode === 'login' ? 'Log in' : 'Create your account'}</h1>
      {mode === 'register' && <label>Name<input required value={f.name} onChange={on('name')} /></label>}
      <label>Email<input type="email" required value={f.email} onChange={on('email')} /></label>
      <label>Password<input type="password" required minLength={6} value={f.password} onChange={on('password')} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn">{mode === 'login' ? 'Log in' : 'Sign up'}</button>
    </form>
  );
}

export function Account() {
  const { user, setUser } = useApp();
  const [orders] = useFetch('/orders/mine');
  const [f, setF] = useState({ name: user.name, password: '' });
  const [msg, setMsg] = useState('');
  const save = async (e) => {
    e.preventDefault();
    try { setUser(await api('/auth/me', { method: 'PUT', body: { name: f.name, ...(f.password && { password: f.password }) } })); setMsg('Details saved'); setF({ ...f, password: '' }); }
    catch (x) { setMsg(x.message); }
  };
  return (
    <>
      <form className="form" onSubmit={save}><h1>Your details</h1>
        <label>Name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>New password (optional)<input type="password" minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {msg && <p role="status">{msg}</p>}<button className="btn">Save details</button></form>
      <h2>Order history</h2>
      {orders && !orders.length && <p className="note">No orders yet.</p>}
      {orders?.map((o) => <div className="row" key={o._id}><span className="grow">{new Date(o.createdAt).toLocaleDateString()} · {o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</span><span>{o.status}</span><strong>{money(o.total)}</strong></div>)}
    </>
  );
}

export function Admin() {
  const [products, , setProducts] = useFetch('/products?limit=200');
  const [orders, , setOrders] = useFetch('/orders');
  const [cats] = useFetch('/products/categories');
  const blank = { name: '', price: '', category: '', image: '', stock: '', description: '' };
  const [f, setF] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');

  const pick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const w = Math.min(600, img.width);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = (img.height * w) / img.width;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      setF({ ...f, image: c.toDataURL('image/jpeg', 0.8) });
    };
    img.src = URL.createObjectURL(file);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updated = await api(`/products/${editId}`, {
          method: 'PUT',
          body: { ...f, price: +f.price, stock: +f.stock }
        });
        setProducts({
          ...products,
          items: products.items.map((p) => (p._id === editId ? updated : p))
        });
        setEditId(null);
      } else {
        const p = await api('/products', { method: 'POST', body: { ...f, price: +f.price, stock: +f.stock } });
        setProducts({ ...products, items: [p, ...products.items] });
      }
      setF(blank);
      setErr('');
    } catch (x) {
      setErr(x.index || x.message);
    }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setF({
      name: p.name || '',
      price: p.price || '',
      category: p.category || '',
      image: p.image || '',
      stock: p.stock || '',
      description: p.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setF(blank);
  };

  const del = async (id) => {
    await api(`/products/${id}`, { method: 'DELETE' });
    setProducts({ ...products, items: products.items.filter((p) => p._id !== id) });
  };

  const status = async (id, s) => {
    const o = await api(`/orders/${id}/status`, { method: 'PUT', body: { status: s } });
    setOrders(orders.map((x) => (x._id === id ? { ...x, status: o.status } : x)));
  };

  return (
    <>
      <h1>Admin</h1>
      <form className="form" onSubmit={saveProduct}>
        <h3>{editId ? 'Edit product' : 'Add product'}</h3>
        
        {Object.keys(blank).filter((k) => k !== 'image' && k !== 'category').map((k) => (
          <label key={k}>
            {k}
            <input required={['name', 'price', 'stock'].includes(k)} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
          </label>
        ))}

        <label>
          category
          <select required value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            <option value="">Select category</option>
            {cats?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>Image URL (optional)<input value={f.image.startsWith('data:') ? '' : f.image} onChange={(e) => setF({ ...f, image: e.target.value })} /></label>
        <label>Or upload from computer<input type="file" accept="image/*" onChange={pick} /></label>
        {f.image.startsWith('data:') && <img src={f.image} alt="Preview" width="120" />}
        {err && <p className="error">{err}</p>}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn">{editId ? 'Update product' : 'Add product'}</button>
          {editId && <button type="button" className="btn" style={{ background: '#64748b' }} onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <h2>Products</h2>
      {products?.items.map((p) => (
        <div className="row" key={p._id}>
          <span className="grow">{p.name} · stock {p.stock}</span>
          <strong>{money(p.price)}</strong>
          <button className="link" onClick={() => startEdit(p)}>Edit</button>
          <button className="link" style={{ color: '#fb7185' }} onClick={() => del(p._id)}>Delete</button>
        </div>
      ))}

      <h2>Orders</h2>
      {orders?.map((o) => (
        <div className="row" key={o._id}>
          <span className="grow">{o.user?.name} · {money(o.total)}</span>
          <select value={o.status} onChange={(e) => status(o._id, e.target.value)}>
            <option>paid</option>
            <option>shipped</option>
            <option>delivered</option>
          </select>
        </div>
      ))}
    </>
  );
}