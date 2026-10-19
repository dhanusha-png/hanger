import React,{useEffect,useState,useMemo,useRef} from 'react';import{createRoot}from'react-dom/client';import{BrowserRouter,useNavigate,useLocation,Link,Routes,Route,Navigate}from'react-router-dom';import{Menu,ShoppingCart,Heart,UserRound,MessageCircle,Search,ChevronRight,ChevronDown,Star,Check,Truck,ShieldCheck,Wrench,MapPin,Phone,Mail,ArrowRight,Plus,Minus,LogOut,Package,Settings,LayoutDashboard,Boxes,Users,ClipboardList,Upload,Image as ImageIcon,Quote,RefreshCw,TrendingUp,TrendingDown,ArrowUpRight,X}from'lucide-react';import{ResponsiveContainer,AreaChart,Area,BarChart,Bar,PieChart,Pie,Cell,XAxis,YAxis,Tooltip,CartesianGrid}from'recharts';import{motion,AnimatePresence}from'framer-motion';import{api,img,uploadFiles}from'./lib/api';import{AuthProvider,useAuth}from'./context/AuthContext';import{LoginPage}from'./auth/LoginPage';import{RegisterPage}from'./auth/RegisterPage';import{ForgotPasswordPage}from'./auth/ForgotPasswordPage';import{HomePage,ProductsPage,SearchPage,InstallationsPage,AboutPage,ContactPage,WishlistPage,CatalogProductCard,CatalogProductDetail,GalleryPage}from'./publicPages';import{MiniCartDrawer}from'./components/layout/MiniCartDrawer';import{Logo}from'./components/Logo';import'./design-system/tokens.css';import'./styles.css';import'./header.css';import'./public-pages.css';import'./components/common/light-sweep.css';import'./premium-ui.css';import'./admin-dashboard.css';import'./auth.css';
import {
  AdminLayout,
  AdminLogin,
  AdminDashboard,
  AdminProducts,
  AdminCategories,
  AdminOrders,
  AdminCustomers,
  AdminEnquiries,
  AdminBookings,
  AdminGallery,
  AdminReviews,
  AdminContent,
  AdminCoupons,
  AdminSubscribers,
  AdminSettings,
  AdminUsers,
  AdminAuditLogs
} from './admin';
const fallbackProducts=[
  {_id:'h1',slug:'multi-purpose-clothes-hanger-stand',name:'Multi-Purpose Clothes Hanger Stand',category:'Hangers',price:2599,compareAtPrice:2999,stock:15,rating:4.8,isFeatured:true,images:[{url:'/products/hanger-multipurpose-stand.jpg'}],features:['Modern minimalist tree branch design','Solid weighted marble base','8 staggered wooden branches']},
  {_id:'h2',slug:'premium-wall-mounted-clothes-hanger',name:'Premium Wall Mounted Clothes Drying Hanger',category:'Hangers',price:2499,compareAtPrice:2999,stock:25,rating:4.9,isFeatured:true,images:[{url:'/products/hanger-premium-wall-mounted.jpg'}],features:['Heavy-duty accordion scissor mechanism','6 parallel stainless steel rods','Rust-resistant powder coating']},
  {_id:'s1',slug:'compact-3-tier-shoe-rack',name:'Compact 3-Tier Shoe Rack',category:'Shoe Racks',price:1899,compareAtPrice:2299,stock:20,rating:4.8,isFeatured:true,images:[{url:'/products/shoe-rack-compact-3-tier.jpg'}],features:['3 slatted natural timber tiers','Holds 9 to 12 pairs of shoes','Rounded safety corners']},
  {_id:'s2',slug:'premium-4-tier-shoe-organizer',name:'Premium 4-Tier Shoe Organizer',category:'Shoe Racks',price:2499,compareAtPrice:2999,stock:16,rating:4.9,isFeatured:true,images:[{url:'/products/shoe-rack-premium-4-tier.jpg'}],features:['4 angled wire mesh tiers with heel stops','Dark walnut timber frame','Holds up to 16 pairs']}
];
const Store=React.createContext(null);function useStore(){return React.useContext(Store)}
function StoreInner({children}){const{user,authLoading,login,register,logout,updateUser}=useAuth();const[products,setProducts]=useState([]);const[productsLoading,setProductsLoading]=useState(true);const[productsError,setProductsError]=useState(false);const[cart,setCart]=useState(JSON.parse(localStorage.getItem('cart')||'[]'));const[cartDrawerOpen,setCartDrawerOpen]=useState(false);const[wishlist,setWishlist]=useState(()=>{try{return JSON.parse(localStorage.getItem('wishlist')||'[]');}catch{return[];}});const[chat,setChat]=useState(false);useEffect(()=>{api('/products').then(setProducts).catch(()=>{setProducts([]);setProductsError(true)}).finally(()=>setProductsLoading(false))},[]);useEffect(()=>{const h=()=>setCartDrawerOpen(true);window.addEventListener('hh-open-cart-drawer',h);return ()=>window.removeEventListener('hh-open-cart-drawer',h)},[]);useEffect(()=>localStorage.setItem('cart',JSON.stringify(cart)),[cart]);useEffect(()=>{try{localStorage.setItem('wishlist',JSON.stringify(wishlist));}catch{}},[wishlist]);const add=(p,qty=1)=>{setCart(c=>{const x=c.find(i=>i.product===p._id);return x?c.map(i=>i.product===p._id?{...i,qty:i.qty+qty}:i):[...c,{product:p._id,name:p.name,price:p.price,image:p.images?.[0]?.url||null,qty,installation:false}]});setCartDrawerOpen(true);};const remove=id=>setCart(c=>c.filter(i=>i.product!==id));const updateQty=(id,qty)=>setCart(c=>c.map(i=>i.product===id?{...i,qty:Math.max(1,qty)}:i));const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const toggleWishlist=product=>setWishlist(w=>{const pId=product._id||product;const exists=w.some(item=>(item._id||item)===pId);return exists?w.filter(item=>(item._id||item)!==pId):[...w,product];});const isInWishlist=productId=>wishlist.some(item=>(item._id||item)===productId);const removeFromWishlist=productId=>setWishlist(w=>w.filter(item=>(item._id||item)!==productId));const moveToCart=product=>{add(product,1);removeFromWishlist(product._id||product);};const clearWishlist=()=>setWishlist([]);return <Store.Provider value={{products,productsLoading,productsError,cart,add,remove,updateQty,total,wishlist,toggleWishlist,isInWishlist,removeFromWishlist,moveToCart,clearWishlist,user,authLoading,login,register,logout,updateUser,chat,setChat,cartDrawerOpen,setCartDrawerOpen}}>{children}<Chatbot/><MiniCartDrawer isOpen={cartDrawerOpen} onClose={()=>setCartDrawerOpen(false)} cart={cart} total={total} onUpdateQty={updateQty} onRemove={remove}/></Store.Provider>}
function Provider({children}){return <AuthProvider><StoreInner>{children}</StoreInner></AuthProvider>}
function Header() {
  const { cart, user, wishlist, logout, setCartDrawerOpen } = useStore();
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const closeMenu = () => { setOpen(false); setAccountMenuOpen(false); };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };

  const realCartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const cartBadgeCount = realCartCount > 0 ? realCartCount : 3;

  return (
    <header className="header">
      <div className="container nav">
        <Logo variant="lockup" height={46} isNavbar={true} onClick={closeMenu} className="brand" />
        <nav id="primary-navigation" aria-label="Primary navigation" className={open ? 'nav-links open' : 'nav-links'}>
          <div className="mobile-drawer-header">
            <Logo variant="lockup" height={36} onClick={closeMenu} className="hh-mobile-drawer-logo" />
            <button type="button" className="mobile-drawer-close" onClick={closeMenu} aria-label="Close navigation menu">✕</button>
          </div>
          <form className="drawer-search-bar" onSubmit={handleSearch}>
            <Search size={16} className="drawer-search-icon" />
            <input
              type="text"
              placeholder="Search products, services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search products, services"
            />
          </form>
          <Link to="/" className={pathname === '/' ? 'active' : ''} onClick={closeMenu}>
            Home
            {pathname === '/' && <span className="nav-gold-indicator" />}
          </Link>
          <Link to="/products" className={pathname.startsWith('/products') ? 'active' : ''} onClick={closeMenu}>
            Products
            {pathname.startsWith('/products') && <span className="nav-gold-indicator" />}
          </Link>
          <Link to="/gallery" className={pathname.startsWith('/gallery') ? 'active' : ''} onClick={closeMenu}>
            Gallery
            {pathname.startsWith('/gallery') && <span className="nav-gold-indicator" />}
          </Link>
          <Link to="/installations" className={(pathname.startsWith('/installations') || pathname.startsWith('/services')) ? 'active' : ''} onClick={closeMenu}>
            Installation & Service
            {(pathname.startsWith('/installations') || pathname.startsWith('/services')) && <span className="nav-gold-indicator" />}
          </Link>
          <Link to="/about" className={pathname.startsWith('/about') ? 'active' : ''} onClick={closeMenu}>
            About
            {pathname.startsWith('/about') && <span className="nav-gold-indicator" />}
          </Link>
          <Link to="/contact" className={pathname.startsWith('/contact') ? 'active' : ''} onClick={closeMenu}>
            Contact
            {pathname.startsWith('/contact') && <span className="nav-gold-indicator" />}
          </Link>
          <Link to="/wishlist" className="mobile-wishlist-link" onClick={closeMenu}>
            Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </Link>
          {user ? (
            <div className="drawer-user-card">
              <div className="drawer-user-info">
                <div className="nav-avatar-mini" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                  {user.avatar ? <img src={img(user.avatar)} alt="" /> : (user.name?.[0] || 'U')}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <b style={{ color: '#fff', fontSize: '14px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</b>
                  <small style={{ color: '#95a8a0', fontSize: '11px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</small>
                </div>
              </div>
              <div className="drawer-user-links">
                <Link to="/account" onClick={closeMenu}>
                  <UserRound size={15} /> <span>Profile</span>
                </Link>
                <Link to="/account" onClick={closeMenu}>
                  <Package size={15} /> <span>My Orders</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeMenu}>
                    <LayoutDashboard size={15} /> <span>Admin Center</span>
                  </Link>
                )}
                <button type="button" className="logout-link" onClick={() => { closeMenu(); logout(); }}>
                  <LogOut size={15} /> <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="drawer-account-wrap">
              <Link to="/login" className="drawer-account-btn" onClick={closeMenu}>
                <UserRound size={17} />
                <span>Login</span>
              </Link>
            </div>
          )}
        </nav>
        <div className="nav-actions">
          <form className="nav-search-bar desktop-only-search" onSubmit={handleSearch}>
            <Search size={15} className="nav-search-icon" />
            <input
              type="text"
              placeholder="Search products, services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search products, services"
            />
          </form>
          <Link to="/wishlist" className="icon-btn wishlist-control" aria-label={`Wishlist${wishlist.length > 0 ? `, ${wishlist.length} items` : ''}`} title="Wishlist" onClick={closeMenu}>
            <Heart size={18} />
            {wishlist.length > 0 && <b>{wishlist.length}</b>}
          </Link>
          <Link to="/cart" className="icon-btn cart-icon" aria-label={`Cart ${cartBadgeCount} items`} title="Cart" onClick={(e)=>{if(setCartDrawerOpen&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();setCartDrawerOpen(true);}closeMenu();}}>
            <ShoppingCart size={18} />
            <b className="cart-badge-gold">{cartBadgeCount}</b>
          </Link>
          {user ? (
            <div className="account-dropdown-wrap desktop-only-account" ref={dropdownRef}>
              <button
                type="button"
                className="profile-pill-btn account-pill-active"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-expanded={accountMenuOpen}
                aria-label="Account Menu"
              >
                <div className="nav-avatar-mini">
                  {user.avatar ? <img src={img(user.avatar)} alt="" /> : (user.name?.[0] || 'U')}
                </div>
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} style={{ transform: accountMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {accountMenuOpen && (
                <div className="account-dropdown-menu">
                  <div className="account-dropdown-header">
                    <b>{user.name}</b>
                    <small>{user.email}</small>
                  </div>
                  <div className="account-dropdown-divider" />
                  <Link to="/account" onClick={closeMenu}>
                    <UserRound size={15} /> <span>Profile</span>
                  </Link>
                  <Link to="/account" onClick={closeMenu}>
                    <Package size={15} /> <span>My Orders</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={closeMenu}>
                      <LayoutDashboard size={15} /> <span>Admin Center</span>
                    </Link>
                  )}
                  <div className="account-dropdown-divider" />
                  <button
                    type="button"
                    className="account-dropdown-logout"
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                  >
                    <LogOut size={15} /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="profile-pill-btn desktop-only-account" aria-label="Login" title="Login" onClick={closeMenu}>
              <UserRound size={16} />
              <span>Login</span>
            </Link>
          )}
          <button className="mobile-menu" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
import { Footer } from './components/layout/Footer';

function Layout({children}){return <><Header/><main>{children}</main><Footer/></>}
function SectionTitle({eyebrow,title,text}){return <div className="section-title"><small>{eyebrow}</small><h2>{title}</h2>{text&&<p>{text}</p>}</div>}
function ProductCard({p}){const{add,toggleWishlist,isInWishlist}=useStore();const nav=useNavigate();return <CatalogProductCard p={p} onAdd={add} onWishlist={()=>toggleWishlist(p)} isLiked={isInWishlist(p._id)} onBuyNow={()=>{add(p,1);nav('/checkout')}}/>}
function ProductDetail({slug}){const{products,add,toggleWishlist,isInWishlist}=useStore();return <Layout><CatalogProductDetail slug={slug} products={products.length?products:fallbackProducts} onAdd={add} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} ProductCard={ProductCard}/></Layout>}
function Booking({quote=false}){const[user]=[useStore().user];const[done,setDone]=useState(false);const[form,setForm]=useState({name:user?.name||'',email:user?.email||'',phone:'',type:'Hanger Installation',address:'',preferredDate:'',preferredTime:'',message:''});const submit=async e=>{e.preventDefault();try{if(quote)await api('/quotes',{method:'POST',body:JSON.stringify({customer:{name:form.name,email:form.email,phone:form.phone},service:form.type,message:form.message,dimensions:form.address})});else await api('/services',{method:'POST',body:JSON.stringify({...form,user:user?._id})});setDone(true)}catch(err){alert(err.message)}};return <Layout><section className="section container form-page"><div className="form-intro"><span className="eyebrow">{quote?'CUSTOM SOLUTION':'BOOK A SERVICE'}</span><h1>{quote?'Request a Free Quote':'Let’s get your service scheduled.'}</h1><p>Share your requirement and our professional team will reach out to understand your space.</p></div>{done?<div className="success-box"><Check/><h2>Request received</h2><p>Thank you. Your request has been recorded. Our team will contact you shortly.</p><Link to="/" className="btn btn-primary">Back Home</Link></div>:<form className="form-card" onSubmit={submit}><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><div className="two"><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Phone<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label></div><label>{quote?'Requirement':'Service'}<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{(quote?['Custom Hanger','Shoe Rack','Installation','Repair / Fixing','Other']:['Hanger Installation','Hanger Repair & Fixing','Custom Hanger Making','Maintenance','Site Measurement','Shoe Rack Installation']).map(x=><option key={x}>{x}</option>)}</select></label><label>Address / Dimensions<textarea rows="3" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>{!quote&&<div className="two"><label>Preferred Date<input type="date" value={form.preferredDate} onChange={e=>setForm({...form,preferredDate:e.target.value})}/></label><label>Preferred Time<input value={form.preferredTime} onChange={e=>setForm({...form,preferredTime:e.target.value})}/></label></div>}<label>Additional Details<textarea rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label><button className="btn btn-primary btn-lg animated-light-button light-hero-btn light-phase-1">{quote?'Submit Quote Request':'Book Service'}</button></form>}</section></Layout>}
function Cart(){const{cart,add,remove,total}=useStore();return <Layout><section className="section container"><SectionTitle eyebrow="YOUR BAG" title="Shopping Cart"/><div className="cart-layout"><div>{cart.length?cart.map(i=><div className="cart-item" key={i.product}><div className="cart-img">{i.image?<img src={img(i.image)} alt={i.name}/>:<Boxes/>}</div><div><h3 style={{fontSize:'16px',margin:'0 0 6px'}}>{i.name}</h3><div style={{display:'flex',alignItems:'center',gap:'8px',margin:'6px 0'}}><span style={{fontSize:'12px',color:'#6e7a76'}}>Qty:</span><button style={{border:'1px solid #d9ddd8',width:'24px',height:'24px',borderRadius:'4px',display:'grid',placeItems:'center'}} onClick={()=>i.qty>1?add(i,-1):remove(i.product)}><Minus size={12}/></button><b style={{fontSize:'14px',minWidth:'18px',textAlign:'center'}}>{i.qty}</b><button style={{border:'1px solid #d9ddd8',width:'24px',height:'24px',borderRadius:'4px',display:'grid',placeItems:'center'}} onClick={()=>add(i,1)}><Plus size={12}/></button></div><b>₹{(i.price*i.qty).toLocaleString('en-IN')}</b></div><button onClick={()=>remove(i.product)} className="icon-btn" title="Remove item" aria-label={`Remove ${i.name}`}><RefreshCw/></button></div>):<div className="empty"><Logo variant="stacked" height={60} style={{marginBottom:'16px'}}/><h3>Your cart is empty</h3><Link to="/products" className="btn btn-primary animated-light-button light-hero-btn light-phase-1">Shop Products</Link></div>}</div>{cart.length>0&&<aside className="summary"><h3>Order Summary</h3><div><span>Subtotal</span><b>₹{total.toLocaleString('en-IN')}</b></div><div><span>Shipping</span><b>{total>=3000?'Free':'₹99'}</b></div><hr/><div className="total"><span>Total</span><b>₹{(total+(total>=3000?0:99)).toLocaleString('en-IN')}</b></div><Link to="/checkout" className="btn btn-primary full animated-light-button light-hero-btn light-phase-1">Proceed to Checkout</Link></aside>}</div></section></Layout>}
function Checkout(){
  const { cart, total, user } = useStore();
  const nav = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const buy = params.get('buy');
  const products = useStore().products;
  const selected = buy ? [(products.length ? products : fallbackProducts).find(p => p._id === buy) || fallbackProducts[0]] : null;
  const items = selected ? [{ product: selected._id, name: selected.name, price: selected.price, image: selected.images?.[0]?.url || null, qty: 1 }] : cart;

  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const rawSum = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = rawSum >= 3000 ? 0 : 99;
  const grandTotal = Math.max(0, rawSum - discountAmount) + shipping;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await api('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode.trim(), amount: rawSum })
      });
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.discount);
        setCouponSuccess(`Coupon applied! ₹${res.discount} discount.`);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  async function place(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?._id,
          items,
          customer: { name: form.name, email: form.email, phone: form.phone },
          address: { fullName: form.name, phone: form.phone, line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, country: 'India' },
          paymentMethod: form.paymentMethod,
          couponCode: appliedCoupon?.code,
          discount: discountAmount
        })
      });
      localStorage.setItem('lastOrder', JSON.stringify(r.order));
      localStorage.removeItem('cart');
      nav('/order-success/' + r.order._id);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <Layout>
        <div className="section container empty">
          <Logo variant="stacked" height={60} style={{ marginBottom: '16px' }} />
          <h2>Your cart is empty.</h2>
          <Link to="/products" className="btn btn-primary">Shop Products</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section container checkout">
        <div>
          <div style={{ marginBottom: '18px' }}>
            <Logo variant="lockup" height={40} />
          </div>
          <span className="eyebrow">SECURE CHECKOUT</span>
          <h1>Complete your order</h1>
          <form className="form-card" onSubmit={place}>
            <label>Full Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <div className="two">
              <label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
              <label>Phone<input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
            </div>
            <h3>Delivery Address</h3>
            <label>Address Line 1<input required value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} /></label>
            <label>Address Line 2<input value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} /></label>
            <div className="three">
              <label>City<input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></label>
              <label>State<input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></label>
              <label>Pincode<input required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} /></label>
            </div>
            <h3>Payment</h3>
            <label className="radio">
              <input type="radio" checked={form.paymentMethod === 'cod'} onChange={() => setForm({ ...form, paymentMethod: 'cod' })} />
              Cash on Delivery <span>Pay cash upon certified installation / delivery</span>
            </label>
            <label className="radio">
              <input type="radio" checked={form.paymentMethod === 'razorpay_demo'} onChange={() => setForm({ ...form, paymentMethod: 'razorpay_demo' })} />
              Online Payment (UPI, Cards, Netbanking) <span>Secure instant digital checkout</span>
            </label>
            <button disabled={submitting} className="btn btn-primary btn-lg full">
              {submitting ? 'Placing Order…' : form.paymentMethod === 'razorpay_demo' ? 'Continue to Secure Payment' : 'Place Cash on Delivery Order'}
            </button>
          </form>
        </div>
        <aside className="summary">
          <h3>Order Summary</h3>
          {items.map(i => (
            <div className="summary-item" key={i.product}>
              <span>{i.name} × {i.qty}</span>
              <b>₹{(i.price * i.qty).toLocaleString('en-IN')}</b>
            </div>
          ))}
          <hr />
          <div style={{ margin: '14px 0' }}>
            <span style={{ fontSize: '12px', color: '#95a8a0', display: 'block', marginBottom: '6px' }}>Have a coupon code?</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                placeholder="Enter promo code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                style={{ margin: 0, padding: '8px 12px', fontSize: '13px' }}
              />
              <button type="button" className="btn btn-soft" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={handleApplyCoupon}>Apply</button>
            </div>
            {couponSuccess && <small style={{ color: '#4ade80', fontSize: '11px', display: 'block', marginTop: '4px' }}>{couponSuccess}</small>}
            {couponError && <small style={{ color: '#f87171', fontSize: '11px', display: 'block', marginTop: '4px' }}>{couponError}</small>}
          </div>
          <hr />
          <div><span>Subtotal</span><b>₹{rawSum.toLocaleString('en-IN')}</b></div>
          {discountAmount > 0 && <div><span>Coupon Discount</span><b style={{ color: '#4ade80' }}>-₹{discountAmount.toLocaleString('en-IN')}</b></div>}
          <div><span>Shipping</span><b>{shipping === 0 ? 'Free' : `₹${shipping}`}</b></div>
          <div className="total"><span>Total</span><b>₹{grandTotal.toLocaleString('en-IN')}</b></div>
        </aside>
      </section>
    </Layout>
  );
}

function Account(){const{user,logout,wishlist,moveToCart,removeFromWishlist}=useStore();const[tab,setTab]=useState('dashboard');const[orders,setOrders]=useState([]);useEffect(()=>{if(user)api('/orders').then(setOrders).catch(()=>{})},[user]);if(!user)return <Navigate to="/login"/>;return <Layout><section className="section container account"><aside className="account-side"><div className="account-profile"><div className="avatar big-avatar">{user.avatar?<img src={img(user.avatar)}/>:user.name?.[0]}</div><b>{user.name}</b><small>{user.email}</small></div>{[['dashboard','Dashboard'],['profile','My Profile'],['orders','My Orders'],['wishlist','Wishlist'],['services','My Services'],['addresses','Saved Addresses'],['notifications','Notifications'],['support','Help & Support'],['security','Security']].map(([id,label])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{label}</button>)}<button onClick={logout}><LogOut/> Logout</button></aside><div className="account-main"><span className="eyebrow">MY ACCOUNT</span>{tab==='dashboard'&&<><h1>Welcome back, {user.name.split(' ')[0]} 👋</h1><div className="account-stats"><div><Package/><b>{orders.length}</b><small>Orders</small></div><div><Heart/><b>{wishlist.length}</b><small>Wishlist</small></div><div><Wrench/><b>0</b><small>Services</small></div><div><Star/><b>0</b><small>Reviews</small></div></div><h2>Recent Orders</h2>{orders.slice(0,3).map(o=><OrderRow key={o._id} o={o}/>)}</>}{tab==='orders'&&<><h1>My Orders</h1>{orders.length?orders.map(o=><OrderRow key={o._id} o={o}/>):<div className="empty">No orders yet.</div>}</>}{tab==='profile'&&<Profile user={user}/>}{tab==='services'&&<div className="empty">Your service history will appear here after booking installation, repair or custom work.</div>}{tab==='wishlist'&&<div><h1>My Saved Items</h1>{wishlist.length?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))',gap:'16px',marginTop:'20px'}}>{wishlist.map(p=><div key={p._id||p.slug} style={{border:'1px solid rgba(232,192,112,0.25)',borderRadius:'16px',overflow:'hidden',background:'rgba(5,15,12,0.85)',backdropFilter:'blur(16px)',padding:'16px',display:'flex',flexDirection:'column'}}><img src={img(p.images?.[0]?.url||p.image)} alt={p.name} style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'10px',background:'#0a1612'}}/><h4 style={{fontSize:'14px',margin:'12px 0 6px',color:'#fff',fontWeight:700}}>{p.name}</h4><div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'14px',marginTop:'auto'}}><span style={{fontWeight:800,color:'#e8c070',fontSize:'17px'}}>₹{Number(p.price||0).toLocaleString('en-IN')}</span>{p.compareAtPrice>p.price&&<span style={{fontSize:'12px',color:'#95a8a0',textDecoration:'line-through'}}>₹{Number(p.compareAtPrice).toLocaleString('en-IN')}</span>}</div><div style={{display:'flex',gap:'8px'}}><button className="wishlist-btn-move" style={{flex:1,padding:'10px 12px',fontSize:'12px'}} onClick={()=>moveToCart(p)}><ShoppingCart size={14}/> Move to Cart</button><button className="btn btn-soft" style={{padding:'10px 12px',fontSize:'12px'}} onClick={()=>removeFromWishlist(p._id)}>Remove</button></div></div>)}</div>:<div className="empty"><Logo variant="stacked" height={52} style={{marginBottom:'12px'}}/>Your wishlist is empty. Tap ♡ on a product to save it.</div>}</div>}{tab==='addresses'&&<div className="empty">Saved addresses can be managed from your profile. Add multiple delivery addresses in the full customer profile editor.</div>}{tab==='notifications'&&<div className="empty">No new notifications.</div>}{tab==='support'&&<div className="support-box"><MessageCircle/><h2>Need help?</h2><p>Ask our AI assistant or contact our team directly through WhatsApp.</p><Link to="/contact" className="btn btn-primary">Contact Us</Link></div>}{tab==='security'&&<div className="support-box"><ShieldCheck/><h2>Account Security</h2><p>Manage your login credentials and profile authentication securely.</p></div>}</div></section></Layout>}
function OrderRow({ o }) {
  const num = o.orderNumber || ('#' + o._id.slice(-6).toUpperCase());
  return (
    <Link to={'/order-success/' + o._id} className="order-row">
      <div>
        <b style={{ color: '#e8c070' }}>Order {num}</b>
        <small>{new Date(o.createdAt).toLocaleDateString('en-IN')}</small>
      </div>
      <span className={`admin-status-badge ${(o.status || 'placed').toLowerCase()}`}>{o.status || 'placed'}</span>
      <b>₹{Number(o.total || 0).toLocaleString('en-IN')}</b>
      <ChevronRight />
    </Link>
  );
}
function Profile({user}){const[form,setForm]=useState({name:user.name||'',phone:user.phone||'',avatar:user.avatar||''});const save=async()=>{const r=await api('/auth/profile',{method:'PUT',body:JSON.stringify(form)});alert('Profile updated.');location.reload()};return <div className="profile-edit"><h1>My Profile</h1><div className="profile-photo"><div className="avatar huge">{form.avatar?<img src={img(form.avatar)}/>:form.name?.[0]}</div><div><h3>Profile photo</h3><p>Use a clear customer photo. It will appear on your customer profile and verified reviews.</p><input type="file" accept="image/*" onChange={async e=>{if(!e.target.files?.[0])return;const fd=new FormData();fd.append('file',e.target.files[0]);const token=localStorage.getItem('token');const r=await fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/auth/avatar',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});const d=await r.json();if(r.ok){setForm(x=>({...x,avatar:d.user.avatar}));alert('Profile photo uploaded.')}else alert(d.message||'Upload failed')}}/></div></div><label>Full Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input value={user.email||''} disabled/></label><label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><button className="btn btn-primary" onClick={save}>Save Profile</button></div>}
export function ProtectedRoute({ children }) {
  const { user, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader text="Verifying session…" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export function AdminRoute({ children, role = 'staff' }) {
  const { user, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader text="Checking administrative access…" />;
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin' && user.role !== 'staff') {
    return <Navigate to="/" replace />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
function OrderSuccess({ id }) {
  const [o, setO] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/orders/' + id)
      .then(data => setO(data))
      .catch(() => {
        try {
          const last = JSON.parse(localStorage.getItem('lastOrder') || 'null');
          if (last && (String(last._id) === String(id) || String(last.orderNumber) === String(id))) {
            setO(last);
          }
        } catch {}
      })
      .finally(() => setLoading(false));
  }, [id]);

  const orderNum = o?.orderNumber || (o?._id ? ('#' + o._id.slice(-6).toUpperCase()) : 'HH-ORDER');
  const statusSteps = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentStepIdx = statusSteps.indexOf((o?.status || 'placed').toLowerCase());

  return (
    <Layout>
      <section className="section container success-page" style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Logo variant="stacked" height={56} />
        </div>
        <div className="success-icon" style={{ width: '64px', height: '64px', background: 'rgba(232, 192, 112, 0.15)', border: '1px solid #e8c070', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 18px', color: '#e8c070' }}>
          <Check size={32} />
        </div>
        <span className="eyebrow" style={{ color: '#e8c070', letterSpacing: '0.14em', fontSize: '11px', fontWeight: 700 }}>ORDER CONFIRMED</span>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#fff', margin: '10px 0 12px' }}>Thank you for your order!</h1>
        <p style={{ color: '#95a8a0', maxWidth: '520px', margin: '0 auto 28px', lineHeight: '1.6' }}>
          Your order has been recorded in our system. A confirmation email has been dispatched. Our operations team is preparing your dispatch.
        </p>

        {o && (
          <div className="order-confirm-card" style={{ background: 'rgba(4, 18, 14, 0.95)', border: '1px solid rgba(232, 192, 112, 0.3)', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '28px', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#95a8a0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Number</span>
                <b style={{ display: 'block', fontSize: '18px', color: '#e8c070', fontWeight: 800 }}>{orderNum}</b>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#95a8a0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment</span>
                <b style={{ display: 'block', fontSize: '14px', color: '#fff' }}>{o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}</b>
              </div>
            </div>

            {/* Status Timeline */}
            <div style={{ margin: '20px 0', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#95a8a0', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '12px' }}>Fulfillment Timeline</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {statusSteps.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  return (
                    <div key={st} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: isDone ? '#e8c070' : '#142921', color: isDone ? '#04120e' : '#6a7c75', display: 'grid', placeItems: 'center', margin: '0 auto 6px', fontSize: '10px', fontWeight: 700, border: isDone ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span style={{ fontSize: '11px', textTransform: 'capitalize', color: isDone ? '#e8c070' : '#6a7c75', fontWeight: isDone ? 600 : 400 }}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary */}
            <div style={{ margin: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <b style={{ fontSize: '13px', color: '#95a8a0', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Items Ordered ({o.items?.length || 0})</b>
              {(o.items || []).map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#fff' }}>{it.name} × {it.qty}</span>
                  <b style={{ color: '#e8c070' }}>₹{Number(it.price * it.qty).toLocaleString('en-IN')}</b>
                </div>
              ))}
            </div>

            {/* Total Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '4px' }}>
              <span style={{ color: '#95a8a0', fontSize: '14px' }}>Total Amount Paid / Due</span>
              <strong style={{ fontSize: '20px', color: '#e8c070', fontWeight: 800 }}>₹{Number(o.total || 0).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          <Link to="/account" className="btn btn-soft">View in My Account</Link>
        </div>
      </section>
    </Layout>
  );
}
function Chatbot(){const{chat,setChat}=useStore();const[msg,setMsg]=useState('');const[messages,setMessages]=useState([{from:'ai',text:'👋 Hello! Welcome to HangerHome. How can I help you today? Would you like to explore Products, book a Service, or check your Orders?'}]);const send=async(text=msg)=>{if(!text.trim())return;setMessages(m=>[...m,{from:'user',text}]);setMsg('');try{const r=await api('/chat',{method:'POST',body:JSON.stringify({message:text})});setMessages(m=>[...m,{from:'ai',text:r.reply}])}catch{setMessages(m=>[...m,{from:'ai',text:'I’m sorry, I’m having trouble right now. Please use Contact Us or WhatsApp.'}])}};return <><button className="chat-fab" onClick={()=>setChat(!chat)} aria-label="Ask HangerHome" title="Ask HangerHome"><MessageCircle/>{!chat&&<span>Ask HangerHome</span>}</button><AnimatePresence>{chat&&<motion.div className="chat-window" initial={{opacity:0,y:20,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}}><div className="chat-head"><div className="chat-head-info"><div className="chat-avatar-pill"><Logo variant="icon" height={22} link={false}/></div><div><b>Hanger Assistant</b><small><span className="chat-online-dot"/>Online · AI Concierge</small></div></div><button className="chat-close-btn" onClick={()=>setChat(false)} aria-label="Close chat">×</button></div><div className="chat-body">{messages.map((m,i)=><div className={'bubble '+m.from} key={i}>{m.text}</div>)}<div className="quick"><button onClick={()=>send('Show me the products')}>✨ Products</button><button onClick={()=>send('I need installation')}>🔧 Installation</button><button onClick={()=>send('How does COD work?')}>💳 Payments</button><button onClick={()=>send('Where are my orders?')}>📦 My Orders</button></div></div><div className="chat-input"><input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about products, services, orders…"/><button onClick={()=>send()} aria-label="Send message"><ArrowRight size={17}/></button></div></motion.div>}</AnimatePresence></>}
function NotFoundPage(){return <Layout><section className="section container empty not-found-page" style={{padding:'90px 20px',textAlign:'center',minHeight:'65vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Logo variant="stacked" height={72} style={{marginBottom:'24px'}}/><span className="eyebrow">404 ERROR</span><h1 style={{fontSize:'clamp(28px, 4vw, 42px)',margin:'12px 0 16px',color:'#fff'}}>Page Not Found</h1><p style={{maxWidth:'480px',margin:'0 auto 28px',color:'#b2c0ba',lineHeight:'1.6'}}>The page you are looking for doesn’t exist or has been moved. Explore our premium home space solutions or return home.</p><div style={{display:'flex',gap:'14px',flexWrap:'wrap',justifyContent:'center'}}><Link to="/" className="btn btn-primary">Return Home</Link><Link to="/products" className="btn btn-soft">Browse Products</Link></div></section></Layout>}
export function PageLoader({text='Loading HangerHome…'}){return <div className="hh-logo-loader" role="status" aria-label="Loading"><Logo variant="icon" height={54} link={false} className="hh-loader-logo"/>{text&&<small style={{color:'var(--hh-text-muted, #95a8a0)',letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'11px',fontWeight:600}}>{text}</small>}</div>}
class RootErrorBoundary extends React.Component{constructor(props){super(props);this.state={hasError:false}}static getDerivedStateFromError(){return{hasError:true}}componentDidCatch(err,info){console.error('App Error:',err,info)}render(){if(this.state.hasError){return <div style={{background:'#04120e',color:'#f7f3ec',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',textAlign:'center'}}><Logo variant="stacked" height={64} style={{marginBottom:'24px'}}/><h1 style={{color:'#fff',marginBottom:'12px'}}>Something went wrong</h1><p style={{color:'#95a8a0',maxWidth:'440px',marginBottom:'24px'}}>An unexpected error occurred. Please refresh or return to the main homepage.</p><a href="/" className="btn btn-primary">Return Home</a></div>}return this.props.children}}
function PublicRoutes(){const{products,productsLoading,productsError,wishlist,removeFromWishlist,moveToCart,clearWishlist,toggleWishlist,isInWishlist,cart,add,remove,updateQty,total,chat,setChat}=useStore();return <Routes><Route path="/" element={<Layout><HomePage products={products} productsLoading={productsLoading} productsError={productsError} ProductCard={ProductCard} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} cart={cart} add={add} remove={remove} total={total} updateQty={updateQty} chat={chat} setChat={setChat}/></Layout>}/><Route path="/products" element={<Layout><ProductsPage products={products} productsLoading={productsLoading} productsError={productsError} ProductCard={ProductCard} cart={cart} total={total} remove={remove} updateQty={updateQty} chat={chat} setChat={setChat}/></Layout>}/><Route path="/search" element={<Layout><SearchPage products={products} productsLoading={productsLoading} productsError={productsError} ProductCard={ProductCard}/></Layout>}/><Route path="/gallery" element={<Layout><GalleryPage cart={cart} total={total} remove={remove} updateQty={updateQty} chat={chat} setChat={setChat}/></Layout>}/><Route path="/products/:slug" element={<ProductDetail slug={useLocation().pathname.split('/').pop()}/>}/><Route path="/services" element={<Navigate to="/installations#service-solutions" replace />} /><Route path="/service-booking" element={<Booking/>}/><Route path="/quote" element={<Booking quote/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/order-success/:id" element={<OrderSuccess id={useLocation().pathname.split('/').pop()}/>}/><Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/forgot-password" element={<ForgotPasswordPage/>}/><Route path="/installations" element={<Layout><InstallationsPage cart={cart} total={total} remove={remove} updateQty={updateQty} chat={chat} setChat={setChat}/></Layout>}/><Route path="/about" element={<Layout><AboutPage cart={cart} total={total} remove={remove} updateQty={updateQty} chat={chat} setChat={setChat}/></Layout>}/><Route path="/contact" element={<Layout><ContactPage cart={cart} total={total} remove={remove} updateQty={updateQty} chat={chat} setChat={setChat}/></Layout>}/><Route path="/wishlist" element={<Layout><WishlistPage wishlist={wishlist} removeFromWishlist={removeFromWishlist} moveToCart={moveToCart} clearWishlist={clearWishlist}/></Layout>}/><Route path="/policies" element={<Layout><div className="section container"><SectionTitle eyebrow="LEGAL" title="Policies"/><div className="policy"><h3>Policies & Service Standards</h3><p>At HangerHome, customer satisfaction is our core priority. All installations include professional testing, standard product warranties, and local support.</p></div></div></Layout>}/>
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
<Route path="/admin/products" element={<AdminRoute role="admin"><AdminProducts /></AdminRoute>} />
<Route path="/admin/categories" element={<AdminRoute role="admin"><AdminCategories /></AdminRoute>} />
<Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
<Route path="/admin/customers" element={<AdminRoute role="admin"><AdminCustomers /></AdminRoute>} />
<Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
<Route path="/admin/contacts" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
<Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
<Route path="/admin/services" element={<AdminRoute><AdminBookings /></AdminRoute>} />
<Route path="/admin/quotes" element={<AdminRoute><AdminBookings /></AdminRoute>} />
<Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
<Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
<Route path="/admin/content" element={<AdminRoute role="admin"><AdminContent /></AdminRoute>} />
<Route path="/admin/coupons" element={<AdminRoute role="admin"><AdminCoupons /></AdminRoute>} />
<Route path="/admin/subscribers" element={<AdminRoute role="admin"><AdminSubscribers /></AdminRoute>} />
<Route path="/admin/settings" element={<AdminRoute role="admin"><AdminSettings /></AdminRoute>} />
<Route path="/admin/users" element={<AdminRoute role="admin"><AdminUsers /></AdminRoute>} />
<Route path="/admin/audit" element={<AdminRoute role="admin"><AdminAuditLogs /></AdminRoute>} />
<Route path="*" element={<NotFoundPage/>}/></Routes>}
function App(){return <RootErrorBoundary><Provider><PublicRoutes/></Provider></RootErrorBoundary>}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
