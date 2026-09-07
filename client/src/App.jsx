import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';
import { getCategories, getProductById, getProducts } from './services/marketplaceService';
import { useMarketplace } from './context/MarketplaceContext.jsx';

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
const slug = (product) => product._id || product.name.toLowerCase().replaceAll(' ', '-');
const categoryLabels = {
  all: 'All products',
  mobiles: 'Mobiles',
  laptops: 'Laptops',
  tvs: 'TVs',
  appliances: 'Appliances',
  accessories: 'Accessories',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-position:${pathname}`);
    const target = navigationType === 'POP' && savedPosition ? Number(savedPosition) : 0;
    requestAnimationFrame(() => window.scrollTo({ top: target, left: 0, behavior: 'auto' }));
    return () => sessionStorage.setItem(`scroll-position:${pathname}`, String(window.scrollY));
  }, [pathname, navigationType]);

  return null;
}

function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isDetailPage = pathname.startsWith('/marketplace/product/');
  const closeMenu = () => setIsMenuOpen(false);
  const navLinks = [
    { label: 'Home', to: '/shop' },
    { label: 'About Us', href: '#about' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Shop', to: '/marketplace', active: true },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Partner With Us', href: '#partner' },
    { label: 'FAQs', href: '#faqs' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f3ff] text-slate-900">
      {!isDetailPage && <header className="fixed inset-x-0 top-4 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-none rounded-[22px] border border-violet-200/80 bg-white/90 px-4 py-2.5 backdrop-blur-md shadow-[0_18px_40px_rgba(76,29,149,0.10)] md:px-7 xl:max-w-[1400px]">
        <div className="flex w-full min-w-0 flex-none items-center justify-between gap-3">
          <Link to="/shop" className="flex items-center" onClick={closeMenu}>
            <img src="/1fi-logo.svg" alt="1Fi" className="h-10 w-10 rounded-xl md:h-11 md:w-11" />
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) =>
              link.to ? (
                <Link key={link.label} to={link.to} onClick={closeMenu} className={`text-sm font-medium transition ${link.active ? 'text-violet-700' : 'text-slate-700 hover:text-violet-700'}`}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={closeMenu} className="text-sm font-medium text-slate-700 transition hover:text-violet-700">
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <>
              <Link to="/marketplace" className="hidden items-center gap-2 rounded-full bg-[#201a36] px-4 py-2 text-xs font-semibold text-white xl:inline-flex">
                Shop Now <ArrowUpRight size={15} />
              </Link>
              <button type="button" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 xl:hidden">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 flex flex-col gap-2 rounded-[22px] border border-violet-200/80 bg-white/95 p-4 shadow-[0_18px_40px_rgba(76,29,149,0.14)] backdrop-blur-md xl:hidden" aria-label="Mobile navigation">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenu}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${link.active ? 'bg-violet-100 text-violet-700' : 'bg-slate-50 text-slate-700'}`}
                >
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={closeMenu} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {link.label}
                </a>
              )
            )}
            <button type="button" onClick={closeMenu} className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#201a36] px-4 py-3 text-sm font-semibold text-white">
              <X size={16} /> Close
            </button>
          </div>
        )}
      </header>}

      {children}

      <footer className="mt-auto border-t border-violet-200 bg-[#201a36] px-5 py-8 text-sm text-violet-100 md:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <img src="/1fi-logo.svg" alt="1Fi" className="h-10 w-10 rounded-xl" />
            <span className="font-semibold text-white">1Fi</span>
          </div>
          <span className="text-violet-200">No-cost EMIs backed by mutual funds.</span>
          <span className="text-violet-300 xl:ml-auto">Marketplace preview · 2026</span>
        </div>
      </footer>
    </div>
  );
}

function SavedPage() {
  const { favorites, toggleFavorite } = useMarketplace();

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-28 md:px-6 lg:pt-32">
      <button type="button" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600" onClick={() => window.history.back()}>
        <ArrowLeft size={16} /> Back
      </button>
      <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">Your collection</p>
      <h1 className="text-4xl font-extrabold tracking-[-0.06em] text-slate-900 md:text-5xl">Saved products</h1>
      <p className="mt-3 text-base text-slate-600">The things you want to come back to.</p>

      {favorites.length ? (
        <div className="mt-10 space-y-4 border-t border-violet-200 pt-4">
          {favorites.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-violet-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover md:h-28 md:w-28" />
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">{item.brand || '1Fi Marketplace'}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{item.name}</h2>
                <strong className="mt-2 block text-sm font-semibold text-slate-700">{money(item.price)}</strong>
              </div>
              <div className="flex items-center gap-3 md:ml-auto">
                <Link to={`/marketplace/product/${item.id}`} className="secondary-btn">
                  View product
                </Link>
                <button type="button" onClick={() => toggleFavorite(item)} className="text-sm font-semibold text-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex max-w-lg flex-col items-center rounded-[32px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <Heart size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-slate-600">Tap the heart on a product to keep it here.</p>
          <Link to="/marketplace" className="primary-btn mt-6">
            Explore marketplace <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}

function CartPage() {
  const { cart, removeFromCart } = useMarketplace();
  const totalPrice = cart.reduce((total, item) => total + Number(item.price || 0), 0);
  const firstItem = cart[0];

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-28 md:px-6 lg:pt-32">
      <button type="button" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600" onClick={() => window.history.back()}>
        <ArrowLeft size={16} /> Back
      </button>
      <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">Your bag</p>
      <h1 className="text-4xl font-extrabold tracking-[-0.06em] text-slate-900 md:text-5xl">Shopping bag</h1>
      <p className="mt-3 text-base text-slate-600">Your selected products, ready when you are.</p>

      {cart.length ? (
        <>
          <div className="mt-10 space-y-4 border-t border-violet-200 pt-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-violet-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover md:h-28 md:w-28" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">Selected variant</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">{item.name}</h2>
                  <strong className="mt-2 block text-sm font-semibold text-slate-700">
                    {item.variant} · {money(item.price)}
                  </strong>
                </div>
                <div className="flex items-center gap-3 md:ml-auto">
                  <Link to={`/marketplace/product/${item.productId || item.id}`} className="secondary-btn">
                    View product
                  </Link>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm font-semibold text-red-500">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-violet-200 bg-white px-5 py-4">
            <span className="text-sm text-slate-600">Total price</span>
            <strong className="text-2xl font-extrabold tracking-[-0.05em] text-slate-900">{money(totalPrice)}</strong>
          </div>
          <p className="mt-3 text-xs text-slate-500">No-cost EMI plans are available on each product.</p>
          <Link to={`/marketplace/product/${firstItem.productId || firstItem.id}`} className="primary-btn mt-6">
            Proceed to EMI selection <ArrowRight size={16} />
          </Link>
        </>
      ) : (
        <div className="mt-12 flex max-w-lg flex-col items-center rounded-[32px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
          <p className="mt-2 text-sm text-slate-600">Add a product from the marketplace to see it here.</p>
          <Link to="/marketplace" className="primary-btn mt-6">
            Explore marketplace <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}

function ShopPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-28 md:px-6 lg:pt-32">
      <div className="rounded-[28px] border border-violet-200 bg-white/75 p-6 shadow-[0_18px_40px_rgba(76,29,149,0.06)] md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-[11px] font-bold tracking-[0.2em] text-violet-700 uppercase">
          <span>Shop</span>
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.07em] text-slate-900 md:text-6xl">
          Good things, made <span className="text-slate-500">possible.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
          Your everyday essentials, made easier with 1Fi.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-[26px] border border-violet-200 bg-white/85 p-5 opacity-80 md:p-7">
          <div>
            <span className="text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">01</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Top Brands</h2>
            <p className="mt-1 text-sm text-slate-600">Explore the brands you already love.</p>
          </div>
          <span className="inline-flex min-w-[112px] shrink-0 justify-center whitespace-nowrap rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold tracking-[0.1em] text-violet-700 uppercase">
            Coming soon
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[26px] border border-violet-200 bg-white/85 p-5 opacity-80 md:p-7">
          <div>
            <span className="text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">02</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Nearby Stores</h2>
            <p className="mt-1 text-sm text-slate-600">Discover great finds around you.</p>
          </div>
          <span className="inline-flex min-w-[112px] shrink-0 justify-center whitespace-nowrap rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold tracking-[0.1em] text-violet-700 uppercase">
            Coming soon
          </span>
        </div>

        <Link to="/marketplace" className="group flex items-center justify-between gap-4 rounded-[26px] border border-violet-200 bg-violet-50 p-5 transition hover:bg-violet-100 md:p-7">
          <div>
            <span className="text-[11px] font-bold tracking-[0.18em] text-violet-700 uppercase">03</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">1Fi Marketplace</h2>
            <p className="mt-1 text-sm text-slate-600">Thoughtfully picked products, made affordable with flexible EMI.</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#201a36] text-white transition group-hover:translate-x-1">
            <ArrowUpRight size={18} />
          </span>
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-slate-600">
        <ShieldCheck size={18} className="text-violet-700" />
        <span>Transparent pricing · Flexible plans · Zero hidden surprises</span>
      </div>
    </main>
  );
}

function LoadingGrid() {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="overflow-hidden rounded-[28px] border border-violet-200 bg-white shadow-sm">
          <div className="h-64 animate-pulse bg-violet-100" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-20 animate-pulse rounded-full bg-violet-100" />
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-violet-100" />
            <div className="h-3 w-full animate-pulse rounded-full bg-violet-100" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-violet-100" />
            <div className="h-6 w-1/3 animate-pulse rounded-full bg-violet-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry, notFound = false }) {
  return (
    <div className="mt-12 flex max-w-xl flex-col items-center rounded-[32px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">!</div>
      <h2 className="text-2xl font-bold text-slate-900">{notFound ? 'Product not found' : 'Unable to load products'}</h2>
      <p className="mt-2 text-sm text-slate-600">{notFound ? "The product you're looking for is unavailable." : 'Something went wrong while loading the marketplace.'}</p>
      <button type="button" className="primary-btn mt-6" onClick={onRetry}>
        {notFound ? 'Back to Marketplace' : 'Try again'} <ArrowRight size={16} />
      </button>
    </div>
  );
}

function EmptyState({ clear }) {
  return (
    <div className="mt-12 flex w-full flex-col items-center rounded-[32px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
        <Search size={20} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">No products found</h2>
      <p className="mt-2 text-sm text-slate-600">Try searching for something else.</p>
      <button type="button" className="secondary-btn mt-6" onClick={clear}>
        Clear search
      </button>
    </div>
  );
}

function ProductCard({ product }) {
  const { favorites, toggleFavorite, addToCart } = useMarketplace();
  const id = slug(product);
  const isFavorite = favorites.some((item) => item.id === id);
  const saveProduct = { id, name: product.name, price: product.price, image: product.images[0] };

  return (
    <Link to={`/marketplace/product/${id}`} className="group overflow-hidden rounded-[28px] border border-violet-200 bg-white shadow-[0_16px_28px_rgba(76,29,149,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_38px_rgba(76,29,149,0.12)]">
      <div className="relative h-64 overflow-hidden bg-violet-50">
        <img src={product.images[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
        <span className="absolute left-3 top-3 rounded-full border border-violet-200 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-violet-700">
          {product.discount}% off
        </span>
        <button
          type="button"
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 text-violet-700'} shadow-sm`}
          aria-label={`${isFavorite ? 'Remove' : 'Save'} ${product.name}`}
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(saveProduct);
          }}
        >
          <Heart size={13} fill={isFavorite ? 'currentColor' : 'none'} />
          <span>{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      <div className="p-4">
        <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">{product.brand}</p>
        <h3 className="mt-2 text-xl font-bold text-slate-900">{product.name}</h3>
        <p className="mt-2 text-sm leading-5 text-slate-600">{product.description}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <strong className="text-2xl font-extrabold tracking-[-0.06em] text-slate-900">{money(product.price)}</strong>
          <span className="text-xs text-slate-400 line-through">{money(product.originalPrice)}</span>
        </div>

        <p className="mt-2 text-xs text-slate-600">
          Starting from <span className="font-bold text-violet-700">{money(product.emiPlans[0].monthlyAmount)}/mo</span>
        </p>

        <button
          type="button"
          className="card-btn mt-4"
          onClick={(event) => {
            event.preventDefault();
            addToCart({ id, productId: id, name: product.name, variant: product.variants[0]?.value || 'Standard', price: product.price, image: product.images[0] });
          }}
        >
          <ShoppingBag size={14} /> Add to bag
        </button>

        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700">
          View details <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [items, groups] = await Promise.all([getProducts({ category, search }), getCategories()]);
      setProducts(items);
      setCategories(groups);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [category, search]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  useEffect(() => {
    if (page > 1) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const visibleProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-28 md:px-6 lg:pt-32">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">1Fi / Shop</p>
          <h1 className="text-4xl font-extrabold tracking-[-0.07em] text-slate-900 md:text-5xl">Marketplace</h1>
          <p className="mt-3 text-base text-slate-600">A considered collection for the way you live.</p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-violet-200 bg-white/90 px-2 py-2 shadow-sm md:self-end">
          <Link to="/saved" className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700">
            <Heart size={14} /> Saved
          </Link>
          <Link to="/cart" className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700">
            <ShoppingBag size={14} /> Bag
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <label className="flex h-16 w-full items-center gap-3 rounded-[22px] border border-violet-200 bg-white px-4 shadow-[0_12px_20px_rgba(76,29,149,0.06)] md:px-5">
          <Search size={19} className="text-violet-700" />
          <input
            aria-label="Search products"
            placeholder="Search by product or brand"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 md:text-base"
          />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch('')} className="text-violet-700">
              <X size={17} />
            </button>
          )}
        </label>

        {search && (
          <p className="mt-3 px-1 text-xs font-semibold text-slate-500">
            {loading ? 'Searching...' : `${products.length} ${products.length === 1 ? 'product' : 'products'} found`}
          </p>
        )}

        <div className="mt-5 flex gap-2 overflow-auto pb-2" role="tablist">
          {['all', ...categories].map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={`rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${category === item ? 'border-[#201a36] bg-[#201a36] text-white' : 'border-violet-200 bg-white text-slate-600 hover:bg-violet-50'}`}
              onClick={() => setCategory(item)}
            >
              {categoryLabels[item] || item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : products.length ? (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard product={product} key={slug(product)} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 border-t border-violet-200 pt-6" aria-label="Product pages">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                <ArrowLeft size={14} /> Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${page === pageNumber ? 'bg-[#201a36] text-white' : 'border border-violet-200 bg-white text-violet-700'}`}
                    aria-current={page === pageNumber ? 'page' : undefined}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
                Next <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState clear={() => { setSearch(''); setCategory('all'); }} />
      )}
    </main>
  );
}

function EmiPlanCard({ plan, selected, onSelect }) {
  return (
    <button type="button" className={`relative w-full rounded-2xl border p-4 text-left ${selected ? 'border-emerald-500 bg-emerald-50' : 'border-violet-200 bg-white'}`} onClick={onSelect} aria-pressed={selected}>
      <span className={`absolute left-4 top-4 flex h-4 w-4 items-center justify-center rounded-full border ${selected ? 'border-violet-700 bg-violet-700 text-white' : 'border-slate-300 bg-white'}`}>
        {selected && <Check size={10} />}
      </span>
      <div className="pl-7">
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-slate-900">{money(plan.monthlyAmount)}</span>
          <small className="text-[11px] text-slate-500">/ month</small>
        </div>
        <div className="mt-1 text-xs text-slate-600">{plan.months} months</div>
        <div className="mt-1 text-[11px] text-slate-500">{plan.interestRate}% interest · Total {money(plan.totalAmount)}</div>
      </div>
    </button>
  );
}

function ProductDetailsContent() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { favorites, cart, toggleFavorite, addToCart } = useMarketplace();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [proceeded, setProceeded] = useState(false);

  const load = () => {
    setLoading(true);
    getProductById(productId)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [productId]);

  useEffect(() => {
    if (product) {
      const variantPrice = product.variants[selectedVariant]?.price || product.price;
      product.discount = product.originalPrice > variantPrice ? Math.round((1 - variantPrice / product.originalPrice) * 100) : 0;
      setProduct({ ...product });
    }
  }, [selectedVariant]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-8 md:px-6">
        <div className="h-[520px] animate-pulse rounded-[26px] bg-violet-100" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-8 md:px-6">
        <ErrorState notFound onRetry={() => navigate('/marketplace')} />
      </main>
    );
  }

  const variant = product.variants[selectedVariant];
  const currentPrice = variant?.price || product.price;
  const productKey = slug(product);
  const isFavorite = favorites.some((item) => item.id === productKey);

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-8 md:px-6">
      <div className="mb-7 flex justify-end">
        <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 p-2 shadow-[0_12px_24px_rgba(76,29,149,0.12)]">
          <Link to="/saved" className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700">
            <Heart size={18} /> Saved{favorites.length > 0 && ` (${favorites.length})`}
          </Link>
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700">
            <ShoppingBag size={18} /> Bag{cart.length > 0 && ` (${cart.length})`}
          </Link>
        </div>
      </div>
      <button type="button" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600" onClick={() => navigate('/marketplace')}>
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <section>
          <div className="overflow-hidden rounded-[28px] border border-violet-200 bg-violet-50 shadow-[0_18px_38px_rgba(76,29,149,0.08)]">
            <img src={variant?.image || product.images[imageIndex]} alt={product.name} className="h-[420px] w-full object-cover md:h-[560px]" />
          </div>
          <div className="mt-4 flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`h-16 w-16 overflow-hidden rounded-2xl border ${imageIndex === index ? 'border-[#201a36]' : 'border-violet-200'} bg-violet-50 md:h-20 md:w-20`}
                onClick={() => setImageIndex(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.07em] text-slate-900 md:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">{product.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <strong className="text-3xl font-extrabold tracking-[-0.06em] text-slate-900">{money(currentPrice)}</strong>
            {product.originalPrice && <>
              <span className="text-sm text-slate-400 line-through">{money(product.originalPrice)}</span>
              <span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-700">{product.discount}% off</span>
            </>}
          </div>

          <div className="h-px bg-violet-200" />

          <div>
            <h2 className="mb-3 text-sm font-bold text-slate-800">Choose your {product.variants[0]?.name.toLowerCase()}</h2>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((item, index) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setSelectedVariant(index);
                    setSelectedEmi(null);
                  }}
                  className={`relative min-w-[140px] rounded-2xl border p-3 text-left ${selectedVariant === index ? 'border-violet-700 bg-violet-50' : 'border-violet-200 bg-white'}`}
                >
                  <span className="block text-sm font-semibold text-slate-800">{item.value}</span>
                  <small className="mt-1 block text-[11px] text-slate-500">{money(item.price)}</small>
                  {selectedVariant === index && <Check size={14} className="absolute right-3 top-3 text-violet-700" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-800">Select an EMI plan</h2>
              <span className="text-[10px] font-semibold text-emerald-700">0% interest available</span>
            </div>
            <div className="space-y-2">
              {product.emiPlans.map((plan) => (
                <EmiPlanCard key={plan._id || plan.months} plan={plan} selected={selectedEmi === plan} onSelect={() => setSelectedEmi(plan)} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-violet-200 bg-white p-4 shadow-[0_15px_30px_rgba(76,29,149,0.08)] md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="block text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">Monthly payment</span>
                <strong className="mt-2 block text-xl font-bold text-slate-900">
                  {selectedEmi ? money(selectedEmi.monthlyAmount) : 'Select a plan'}
                </strong>
                {selectedEmi && <span className="mt-1 block text-xs text-slate-500">for {selectedEmi.months} months · {selectedEmi.interestRate}% interest</span>}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="secondary-btn whitespace-nowrap px-4 py-3"
                  onClick={() => {
                    addToCart({ id: `${productKey}-${variant.value}`, productId: productKey, name: product.name, variant: variant.value, price: variant.price, image: product.images[0] });
                    setAdded(true);
                  }}
                >
                  {added ? 'Added to bag' : 'Add to bag'} <ShoppingBag size={16} />
                </button>
                <button
                  type="button"
                  disabled={!selectedEmi}
                  className="primary-btn whitespace-nowrap px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => {
                    addToCart({ id: `${productKey}-${variant.value}`, productId: productKey, name: product.name, variant: variant.value, price: variant.price, emiPlan: selectedEmi, image: product.images[0] });
                    setProceeded(true);
                  }}
                >
                  Proceed to EMI <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold ${isFavorite ? 'border-red-200 bg-red-50 text-red-600' : 'border-violet-200 bg-violet-50 text-violet-700'}`}
              aria-label={`${isFavorite ? 'Remove' : 'Save'} ${product.name}`}
              onClick={() => toggleFavorite({ id: productKey, name: product.name, price: variant.price, image: product.images[0] })}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </section>
      </div>

      {proceeded && selectedEmi && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#201a36]/45 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="emi-confirmation-title">
          <div className="w-full max-w-md rounded-[30px] border border-violet-200 bg-white p-6 shadow-[0_25px_70px_rgba(32,26,54,0.25)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-violet-700 uppercase">EMI selection ready</p>
                <h2 id="emi-confirmation-title" className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-slate-900">Let’s continue with your plan.</h2>
              </div>
              <button type="button" aria-label="Close EMI confirmation" onClick={() => setProceeded(false)} className="rounded-full bg-violet-50 p-2 text-violet-700">
                <X size={17} />
              </button>
            </div>
            <div className="mt-6 rounded-2xl bg-violet-50 p-4">
              <div className="flex items-end justify-between gap-3">
                <strong className="text-2xl font-extrabold tracking-[-0.05em] text-slate-900">{money(selectedEmi.monthlyAmount)}</strong>
                <span className="text-xs text-slate-600">/ month</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{selectedEmi.months} months · {selectedEmi.interestRate}% interest · Total {money(selectedEmi.totalAmount)}</p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="secondary-btn" onClick={() => setProceeded(false)}>Review plan</button>
              <Link to="/cart" className="primary-btn">Continue to bag <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProductDetailsPage() {
  return <ProductDetailsContent />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<ShopPage />} />
        </Routes>
      </Layout>
    </>
  );
}
