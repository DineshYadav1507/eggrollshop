import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(() => setMessage('API is unavailable')); }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const visible = products.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));
  const total = useMemo(() => cart.reduce((s, i) => s + Number(i.price) * i.qty, 0), [cart]);

  function add(product) {
    setCart(c => { const found = c.find(i => i.id === product.id); return found ? c.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i) : [...c, {...product, qty: 1}]; });
  }
  function change(id, delta) { setCart(c => c.map(i => i.id === id ? {...i, qty: i.qty + delta} : i).filter(i => i.qty > 0)); }
  async function checkout() {
    if (!customer.name || !customer.phone || !cart.length) return setMessage('Enter name, phone and add an item.');
    const r = await fetch(`${API}/orders`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({customerName: customer.name, phone: customer.phone, items: cart, total}) });
    const data = await r.json();
    setMessage(data.message || 'Order submitted'); if (r.ok) { setCart([]); setCustomer({name:'', phone:''}); }
  }

  return <>
    <header><div className="brand">🥚 EggRoll <span>Shop</span></div><div className="tag">Hot • Fresh • Fast</div></header>
    <section className="hero"><div><p className="eyebrow">MADE FRESH TO ORDER</p><h1>Roll into<br/><em>something delicious.</em></h1><p>Street-style egg rolls packed with bold Indian flavours.</p></div><div className="heroEgg">🍳</div></section>
    <main><div className="toolbar"><input placeholder="Search egg rolls..." value={search} onChange={e=>setSearch(e.target.value)}/><div className="cats">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div></div>
      <div className="layout"><section className="grid">{visible.map(p=><article className="card" key={p.id}><img src={p.image_url} alt={p.name}/><div className="cardBody"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div className="priceRow"><strong>₹{Number(p.price).toFixed(0)}</strong><button onClick={()=>add(p)}>+ Add</button></div></div></article>)}</section>
      <aside><h2>Your Cart</h2>{!cart.length?<p className="muted">Your cart is waiting for something tasty.</p>:cart.map(i=><div className="cartItem" key={i.id}><div><b>{i.name}</b><span>₹{Number(i.price).toFixed(0)} × {i.qty}</span></div><div><button onClick={()=>change(i.id,-1)}>−</button><button onClick={()=>change(i.id,1)}>+</button></div></div>)}<div className="total"><span>Total</span><b>₹{total.toFixed(0)}</b></div><input placeholder="Your name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/><input placeholder="Phone number" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/><button className="checkout" onClick={checkout}>Place Order</button>{message&&<p className="message">{message}</p>}</aside></div></main>
    <footer>© 2026 EggRoll Shop • Built with React + Node.js + MySQL</footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
