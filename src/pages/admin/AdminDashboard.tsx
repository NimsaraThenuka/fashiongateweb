import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  LogOut,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Package,
  Image as ImageIcon,
  Database,
  ExternalLink,
  RefreshCw,
  Check,
  AlertTriangle,
  LayoutGrid,
  List,
  ShoppingBag,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Printer,
  Copy
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Product } from '../../data/products';
import { Order, OrderStatus } from '../../types/order';
import { ProductModal } from '../../components/admin/ProductModal';
import {
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  clearStoredFirebaseConfig,
  FirebaseConfig
} from '../../services/firebase';

const LOGO_URL = 'https://res.cloudinary.com/dyp247eoh/image/upload/v1784785679/Fashion_Gate_JPG_02.jpg-removebg-preview_epbtzx.png';

export default function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    resetToDefaults,
    syncAllToCloud,
    isSyncing,
    cloudSyncStatus,
  } = useProducts();

  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { adminEmail, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Top-Level Main Section Tab: 'products' or 'orders'
  const [mainSection, setMainSection] = useState<'products' | 'orders'>('products');

  // Products Tab Filter State
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men' | 'kids' | 'accessories' | 'new' | 'outofstock' | 'sale'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Orders State & Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [adminStatusNote, setAdminStatusNote] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Cloudinary tester modal
  const [cloudinaryTesterOpen, setCloudinaryTesterOpen] = useState(false);
  const [testedUrl, setTestedUrl] = useState('');
  const [cloudinaryCopied, setCloudinaryCopied] = useState(false);

  // Firebase Config Modal / Tab
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [fbConfig, setFbConfig] = useState<FirebaseConfig>(() => {
    return getStoredFirebaseConfig();
  });
  const [fbSavedStatus, setFbSavedStatus] = useState(false);
  const [manualSyncDone, setManualSyncDone] = useState(false);
  const [stockToast, setStockToast] = useState<{ msg: string; inStock: boolean } | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleToggleStock = (id: number, currentInStock: boolean, name: string) => {
    toggleStock(id);
    setStockToast({
      msg: `"${name}" marked as ${currentInStock ? 'OUT OF STOCK' : 'IN STOCK'}`,
      inStock: !currentInStock,
    });
    setTimeout(() => setStockToast(null), 3000);
  };

  const handleManualSync = async () => {
    const success = await syncAllToCloud();
    if (success) {
      setManualSyncDone(true);
      setTimeout(() => setManualSyncDone(false), 2500);
    }
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Tab filter
    if (activeTab === 'women') result = result.filter(p => p.category === 'women');
    else if (activeTab === 'men') result = result.filter(p => p.category === 'men');
    else if (activeTab === 'kids') result = result.filter(p => p.category === 'kids');
    else if (activeTab === 'accessories') result = result.filter(p => p.category === 'accessories');
    else if (activeTab === 'new') result = result.filter(p => p.badge === 'new' || p.category === 'new');
    else if (activeTab === 'outofstock') result = result.filter(p => !p.inStock);
    else if (activeTab === 'sale') result = result.filter(p => p.badge === 'sale' || Boolean(p.originalPrice));

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.id.toString() === q
      );
    }

    return result;
  }, [products, activeTab, searchQuery]);

  // Product Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const women = products.filter(p => p.category === 'women').length;
    const men = products.filter(p => p.category === 'men').length;
    const kids = products.filter(p => p.category === 'kids').length;
    const accessories = products.filter(p => p.category === 'accessories').length;
    const inStock = products.filter(p => p.inStock).length;
    const outOfStock = products.filter(p => !p.inStock).length;
    const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);

    return { total, women, men, kids, accessories, inStock, outOfStock, totalValue };
  }, [products]);

  // Orders Statistics
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const shipped = orders.filter(o => o.status === 'shipped' || o.status === 'out_for_delivery').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return { totalOrders, processing, confirmed, shipped, delivered, cancelled, totalRevenue };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (orderStatusFilter !== 'all') {
      result = result.filter(o => o.status === orderStatusFilter);
    }

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.customer.city.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          (o.customer.address && o.customer.address.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    await updateOrderStatus(orderId, newStatus, note);
    if (selectedOrder && selectedOrder.id === orderId) {
      // Refresh selected order state
      const updated = orders.find(o => o.id === orderId);
      if (updated) {
        setSelectedOrder({ ...updated, status: newStatus });
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    setDeleteOrderId(null);
    if (selectedOrder?.id === orderId) {
      setOrderDetailModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredFirebaseConfig(fbConfig);
    setFbSavedStatus(true);
    setTimeout(() => {
      setFbSavedStatus(false);
      setFirebaseModalOpen(false);
    }, 1200);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Processing
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-blue-500/15 border border-blue-500/40 text-blue-400">
            <CheckCircle2 size={11} /> Confirmed
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-purple-500/15 border border-purple-500/40 text-purple-400">
            <Truck size={11} /> Dispatched
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-cyan-500/15 border border-cyan-500/40 text-cyan-400">
            <Truck size={11} /> Out For Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 size={11} /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-red-500/15 border border-red-500/40 text-red-400">
            <XCircle size={11} /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      {/* Top Luxury Admin Header Bar */}
      <header className="bg-[#111111] border-b border-white/10 sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Section Switcher */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={LOGO_URL} alt="Fashion Gate" className="h-11 w-auto brightness-0 invert" />
              <div className="border-l border-white/20 pl-3 hidden sm:block">
                <p className="text-sm font-bold text-white tracking-wider">FASHION GATE</p>
                <p className="text-[9px] text-[#C4922A] tracking-[0.2em] uppercase font-mono">Administration Hub</p>
              </div>
            </Link>

            {/* Main Section Navigation Switcher */}
            <div className="flex bg-black/60 border border-white/15 p-1 rounded-sm">
              <button
                type="button"
                onClick={() => setMainSection('products')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  mainSection === 'products'
                    ? 'bg-[#C4922A] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={14} />
                <span>Products ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMainSection('orders')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer relative ${
                  mainSection === 'orders'
                    ? 'bg-[#C4922A] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShoppingBag size={14} />
                <span>Orders ({orders.length})</span>
                {orderStats.processing > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Action Tools & Admin Profile */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Live Firestore Connection Status & One-Click Sync */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className={`hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-xs text-[11px] font-medium border transition-all cursor-pointer ${
                manualSyncDone || cloudSyncStatus === 'connected'
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900'
                  : isSyncing || cloudSyncStatus === 'syncing'
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 animate-pulse cursor-wait'
                  : 'bg-zinc-900 border-white/20 text-white/70 hover:bg-zinc-800'
              }`}
              title="Click to push all catalog items to Firestore Cloud"
            >
              {manualSyncDone ? (
                <><Check size={13} className="text-emerald-400" /> Firestore Synced!</>
              ) : isSyncing || cloudSyncStatus === 'syncing' ? (
                <><RefreshCw size={13} className="animate-spin text-amber-400" /> Syncing Cloud...</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Firebase Live: fasion-gate</>
              )}
            </button>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider text-white/70 hover:text-white border border-white/15 rounded-xs transition-colors hover:border-[#C4922A]"
            >
              <ExternalLink size={13} /> View Live Store
            </Link>

            {mainSection === 'products' ? (
              <>
                <button
                  onClick={() => setCloudinaryTesterOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider text-[#C4922A] bg-[#C4922A]/10 border border-[#C4922A]/40 rounded-xs hover:bg-[#C4922A]/20 transition-all cursor-pointer"
                >
                  <ImageIcon size={13} /> Cloudinary Link Tool
                </button>

                <button
                  onClick={() => setFirebaseModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider text-white/70 hover:text-white border border-white/15 rounded-xs transition-colors hover:border-[#C4922A] cursor-pointer"
                >
                  <Database size={13} /> Firebase Sync
                </button>

                <button
                  onClick={handleOpenAdd}
                  className="btn-gold py-2 px-4 text-xs tracking-wider uppercase font-bold hidden md:flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus size={15} /> Add New Piece
                </button>
              </>
            ) : (
              <Link
                to="/order-tracking"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider text-[#C4922A] bg-[#C4922A]/10 border border-[#C4922A]/40 rounded-xs hover:bg-[#C4922A]/20 transition-all cursor-pointer"
              >
                <Truck size={13} /> Customer Tracking Portal
              </Link>
            )}

            {/* Admin Profile */}
            {adminEmail && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xs text-[11px] text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-white/90">{adminEmail}</span>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-white/50 hover:text-red-400 border border-white/10 hover:border-red-400/40 rounded-xs transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* =========================================================================
            SECTION 1: PRODUCTS CATALOG VIEW
            ========================================================================= */}
        {mainSection === 'products' && (
          <>
            {/* KPI / Analytics Cards */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Total Catalog</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stats.total}</p>
                <p className="text-[10px] text-[#C4922A] tracking-wider uppercase mt-1">Live Products</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Women's</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{stats.women}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Dresses, Sarees &amp; Tops</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Men's</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{stats.men}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Shirts, Blazers &amp; Sarongs</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Kids'</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{stats.kids}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Girls, Boys &amp; Sets</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Inventory Health</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">{stats.inStock} In</span>
                  <span className="text-white/30 text-xs">/</span>
                  <span className="text-lg font-bold text-red-400 tracking-tight">{stats.outOfStock} Out</span>
                </div>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Active Status</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Catalog Value</p>
                <p className="text-xl font-extrabold text-[#C4922A] truncate tracking-tight">
                  Rs. {stats.totalValue.toLocaleString()}
                </p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Cumulative Unit Price</p>
              </div>
            </section>

            {/* Toolbar: Category Tabs & Search Bar */}
            <section className="bg-[#121212] border border-white/10 p-4 rounded-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Collection Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: `All Items (${stats.total})` },
                    { id: 'women', label: `Women's (${stats.women})` },
                    { id: 'men', label: `Men's (${stats.men})` },
                    { id: 'kids', label: `Kids' (${stats.kids})` },
                    { id: 'accessories', label: `Accessories (${stats.accessories})` },
                    { id: 'new', label: 'New In' },
                    { id: 'sale', label: 'Sale / Offers' },
                    { id: 'outofstock', label: `Out of Stock (${stats.outOfStock})` },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase font-semibold transition-all rounded-xs cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#C4922A] text-white shadow-sm font-bold'
                          : 'border border-white/10 text-white/60 hover:text-white hover:border-white/25 bg-black/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* View Switcher & Reset Defaults Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={resetToDefaults}
                    className="px-3 py-2 text-[10px] tracking-wider uppercase text-white/40 hover:text-amber-300 border border-white/10 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restore default catalog items"
                  >
                    <RefreshCw size={12} /> Reset Defaults
                  </button>

                  <div className="flex border border-white/10 rounded-xs overflow-hidden">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 transition-colors cursor-pointer ${
                        viewMode === 'table' ? 'bg-[#C4922A] text-white' : 'text-white/40 hover:text-white bg-black/30'
                      }`}
                      aria-label="Table View"
                    >
                      <List size={15} />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-[#C4922A] text-white' : 'text-white/40 hover:text-white bg-black/30'
                      }`}
                      aria-label="Grid View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search bar & status text */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="relative w-full sm:max-w-md">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products by title, subcategory, ID..."
                    className="w-full bg-[#181818] border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/40 self-start sm:self-center">
                  Displaying <strong className="text-white">{filteredProducts.length}</strong> items in{' '}
                  <span className="text-[#C4922A] uppercase font-mono font-semibold">{activeTab}</span>
                </p>
              </div>
            </section>

            {/* Product List: Table or Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 rounded-sm p-16 text-center">
                <Package size={40} className="mx-auto text-white/20 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
                <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
                  No pieces match your search or active category filter. Create a new piece or clear filters.
                </p>
                <button onClick={handleOpenAdd} className="btn-gold py-2.5 px-6 text-xs uppercase tracking-wider font-bold">
                  Add First Piece
                </button>
              </div>
            ) : viewMode === 'table' ? (
              /* Table View */
              <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#161616] text-[10px] tracking-[0.15em] uppercase text-white/60 font-semibold">
                        <th className="py-4 px-4 w-12">ID</th>
                        <th className="py-4 px-4">Item Details</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Price (LKR)</th>
                        <th className="py-4 px-4">Sizes &amp; Colors</th>
                        <th className="py-4 px-4">Badge</th>
                        <th className="py-4 px-4 text-center">Stock</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                          {/* ID */}
                          <td className="py-4 px-4 font-mono text-xs text-white/40">#{product.id}</td>

                          {/* Image & Title */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3 min-w-[220px]">
                              <div className="w-12 h-16 bg-black/40 border border-white/10 rounded-xs overflow-hidden shrink-0 relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold text-white group-hover:text-[#C4922A] transition-colors leading-snug">
                                  {product.name}
                                </p>
                                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                                  {product.subcategory}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs border border-white/10 bg-black/40 text-white/80">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4">
                            <p className="font-bold text-[#E8B84B]">Rs. {product.price.toLocaleString()}</p>
                            {product.originalPrice && (
                              <p className="text-[11px] text-white/30 line-through">
                                Rs. {product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </td>

                          {/* Sizes & Colors */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 max-w-[180px]">
                              <div className="flex flex-wrap gap-1">
                                {product.sizes?.slice(0, 3).map(s => (
                                  <span key={s} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-xs text-white/70">
                                    {s}
                                  </span>
                                ))}
                                {(product.sizes?.length || 0) > 3 && (
                                  <span className="text-[9px] text-white/40">+{product.sizes.length - 3}</span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/40 truncate">
                                {product.colors?.join(', ') || 'Standard'}
                              </p>
                            </div>
                          </td>

                          {/* Badge */}
                          <td className="py-4 px-4">
                            {product.badge ? (
                              <span
                                className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-xs ${
                                  product.badge === 'sale'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : product.badge === 'limited'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : product.badge === 'trending'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {product.badge}
                              </span>
                            ) : (
                              <span className="text-white/20 text-xs">—</span>
                            )}
                          </td>

                          {/* In Stock toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(product.id, product.inStock, product.name)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                                product.inStock
                                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 shadow-sm'
                                  : 'border-red-500/50 bg-red-500/15 text-red-400 hover:bg-red-500/25 shadow-sm'
                              }`}
                            >
                              {product.inStock ? <><CheckCircle2 size={12} /> In Stock</> : <><XCircle size={12} /> Out of Stock</>}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/product/${product.id}`}
                                target="_blank"
                                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                                title="View on site"
                              >
                                <Eye size={14} />
                              </Link>
                              <button
                                onClick={() => handleOpenEdit(product)}
                                className="p-1.5 text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10 rounded-xs transition-colors cursor-pointer"
                                title="Edit Piece"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(product.id)}
                                className="p-1.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-xs transition-colors cursor-pointer"
                                title="Delete Piece"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-[#C4922A]/50 transition-all shadow-md"
                  >
                    {/* Image & Badge overlay */}
                    <div className="relative aspect-[3/4] bg-black/40 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                      {product.badge && (
                        <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-xs bg-black/80 border border-white/20 text-[#E8B84B]">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleStock(product.id, product.inStock, product.name)}
                        className={`absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-xs border backdrop-blur-xs cursor-pointer shadow-md transition-all ${
                          product.inStock
                            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 hover:bg-emerald-900'
                            : 'bg-red-950/90 border-red-500 text-red-300 hover:bg-red-900'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-[9px] text-[#C4922A] uppercase tracking-widest font-mono font-semibold">
                          {product.category} · {product.subcategory}
                        </p>
                        <h4 className="font-semibold text-sm text-white mt-1 line-clamp-1 group-hover:text-[#C4922A] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-white/40 line-clamp-2 mt-1 font-light leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#E8B84B]">Rs. {product.price.toLocaleString()}</p>
                          {product.originalPrice && (
                            <p className="text-[10px] text-white/30 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 bg-white/5 hover:bg-[#C4922A] hover:text-black rounded-xs transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded-xs transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* =========================================================================
            SECTION 2: ORDERS MANAGEMENT VIEW
            ========================================================================= */}
        {mainSection === 'orders' && (
          <div className="space-y-8 animate-fade-in">
            {/* Orders KPI Metrics */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Total Orders</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{orderStats.totalOrders}</p>
                <p className="text-[10px] text-[#C4922A] tracking-wider uppercase mt-1">All Placed Orders</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Total Revenue</p>
                <p className="text-xl font-extrabold text-[#E8B84B] truncate tracking-tight">
                  Rs. {orderStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-400 tracking-wider uppercase mt-1">Active Sales</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Processing</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-extrabold text-amber-400 tracking-tight">{orderStats.processing}</p>
                  {orderStats.processing > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Needs Review</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Confirmed</p>
                <p className="text-3xl font-extrabold text-blue-400 tracking-tight">{orderStats.confirmed}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Ready for Courier</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">In Transit</p>
                <p className="text-3xl font-extrabold text-purple-400 tracking-tight">{orderStats.shipped}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Dispatched / Delivery</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Delivered</p>
                <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">{orderStats.delivered}</p>
                <p className="text-[10px] text-emerald-400/70 tracking-wider uppercase mt-1">Completed</p>
              </div>
            </section>

            {/* Orders Toolbar: Filters & Search */}
            <section className="bg-[#121212] border border-white/10 p-4 rounded-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: `All Orders (${orderStats.totalOrders})` },
                    { id: 'processing', label: `Processing (${orderStats.processing})` },
                    { id: 'confirmed', label: `Confirmed (${orderStats.confirmed})` },
                    { id: 'shipped', label: `Dispatched (${orderStats.shipped})` },
                    { id: 'delivered', label: `Delivered (${orderStats.delivered})` },
                    { id: 'cancelled', label: `Cancelled (${orderStats.cancelled})` },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id as any)}
                      className={`px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase font-semibold transition-all rounded-xs cursor-pointer ${
                        orderStatusFilter === tab.id
                          ? 'bg-[#C4922A] text-white shadow-sm font-bold'
                          : 'border border-white/10 text-white/60 hover:text-white hover:border-white/25 bg-black/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-white/40 font-mono">
                  Real-time sync enabled with Cloud Firestore
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="relative w-full sm:max-w-md">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order ID (e.g. FG-2026-8942), customer name, address, phone..."
                    className="w-full bg-[#181818] border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/40 self-start sm:self-center">
                  Displaying <strong className="text-white">{filteredOrders.length}</strong> orders in{' '}
                  <span className="text-[#C4922A] uppercase font-mono font-semibold">{orderStatusFilter}</span>
                </p>
              </div>
            </section>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 rounded-sm p-16 text-center">
                <ShoppingBag size={40} className="mx-auto text-white/20 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Orders Found</h3>
                <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
                  {orderSearchQuery || orderStatusFilter !== 'all'
                    ? 'No orders match your search criteria or selected status filter.'
                    : 'Customer orders placed through Checkout will automatically appear here in real time.'}
                </p>
                <Link to="/shop" target="_blank" className="btn-gold py-2.5 px-6 text-xs uppercase tracking-wider font-bold">
                  Browse Boutique
                </Link>
              </div>
            ) : (
              <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#161616] text-[10px] tracking-[0.15em] uppercase text-white/60 font-semibold">
                        <th className="py-4 px-4 w-40">Order ID &amp; Date</th>
                        <th className="py-4 px-4 min-w-[320px]">Customer &amp; Delivery Address</th>
                        <th className="py-4 px-4">Items Summary</th>
                        <th className="py-4 px-4">Amount &amp; Payment</th>
                        <th className="py-4 px-4">Live Status</th>
                        <th className="py-4 px-4">Change Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredOrders.map(order => {
                        const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        const totalItemQty = order.items.reduce((sum, it) => sum + it.quantity, 0);

                        return (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                            {/* Order ID & Date */}
                            <td className="py-4 px-4">
                              <span className="font-mono text-xs font-bold text-[#E8B84B] block">
                                {order.id}
                              </span>
                              <span className="text-[10px] text-white/40 block mt-0.5">
                                {dateFormatted}
                              </span>
                              <span className="text-[9px] font-mono text-white/30 block">
                                {order.trackingNumber}
                              </span>
                            </td>

                            {/* Customer & Delivery Address Cell */}
                            <td className="py-4 px-4">
                              <div className="space-y-2 max-w-sm">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <User size={13} className="text-[#C4922A] shrink-0" />
                                    <span className="font-bold text-white text-sm tracking-wide">
                                      {order.customer.fullName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Phone size={12} className="text-emerald-400 shrink-0" />
                                    <a
                                      href={`tel:${order.customer.phone}`}
                                      className="text-xs font-mono font-semibold text-emerald-400 hover:underline"
                                    >
                                      {order.customer.phone}
                                    </a>
                                  </div>
                                </div>

                                {/* Full Delivery Street Address Box */}
                                <div className="bg-[#181818] border border-white/10 p-2.5 rounded-xs space-y-1">
                                  <div className="flex items-start gap-1.5">
                                    <MapPin size={13} className="text-[#E8B84B] shrink-0 mt-0.5" />
                                    <p className="text-xs text-white/95 font-semibold leading-relaxed">
                                      {order.customer.address || 'Address provided at checkout'}
                                    </p>
                                  </div>
                                  <p className="text-[11px] text-white/60 pl-4 font-normal">
                                    {order.customer.city}, {order.customer.province} {order.customer.postalCode ? `(${order.customer.postalCode})` : ''}
                                  </p>
                                </div>

                                {/* Prominent Direct Button to Open Full Details Modal */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setOrderDetailModalOpen(true);
                                  }}
                                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#C4922A]/15 hover:bg-[#C4922A] hover:text-black text-[#E8B84B] border border-[#C4922A]/50 rounded-xs text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                                >
                                  <Eye size={13} /> View Order Details
                                </button>
                              </div>
                            </td>

                            {/* Items Summary */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2.5">
                                {order.items[0] && (
                                  <div className="w-10 h-13 bg-black/40 border border-white/10 rounded-xs overflow-hidden shrink-0">
                                    <img
                                      src={order.items[0].image}
                                      alt={order.items[0].name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="max-w-[180px]">
                                  <p className="text-xs font-medium text-white/90 line-clamp-1">
                                    {order.items[0]?.name || 'Item'}
                                  </p>
                                  <p className="text-[10px] text-white/40 mt-0.5">
                                    {totalItemQty} {totalItemQty === 1 ? 'piece' : 'pieces'}
                                    {order.items.length > 1 && ` (${order.items.length} unique)`}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Amount & Payment */}
                            <td className="py-4 px-4">
                              <p className="font-bold text-[#E8B84B] text-sm">
                                Rs. {order.total.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-white/10 rounded-xs text-white/70">
                                  {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'card' ? 'CARD' : 'BANK'}
                                </span>
                                <span
                                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                                    order.paymentStatus === 'paid'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-amber-500/20 text-amber-400'
                                  }`}
                                >
                                  {order.paymentStatus}
                                </span>
                              </div>
                            </td>

                            {/* Live Status Badge */}
                            <td className="py-4 px-4">
                              {getStatusBadge(order.status)}
                            </td>

                            {/* Quick Status Select */}
                            <td className="py-4 px-4">
                              <select
                                value={order.status}
                                onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                className="bg-[#181818] border border-white/20 text-white text-xs px-2.5 py-1.5 rounded-xs outline-none focus:border-[#C4922A] cursor-pointer"
                              >
                                <option value="processing">Processing</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Dispatched</option>
                                <option value="out_for_delivery">Out For Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setOrderDetailModalOpen(true);
                                  }}
                                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
                                  title="View Full Order Invoice & Customer Details"
                                >
                                  <Eye size={15} />
                                </button>
                                <Link
                                  to={`/order-tracking?id=${order.id}`}
                                  target="_blank"
                                  className="p-1.5 text-[#C4922A] hover:bg-[#C4922A]/10 rounded-xs transition-colors"
                                  title="Open Public Tracking Page"
                                >
                                  <Truck size={15} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setDeleteOrderId(order.id)}
                                  className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xs transition-colors cursor-pointer"
                                  title="Delete Order Record"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          ORDER DETAILS & INVOICE MODAL
          ========================================================================= */}
      {orderDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-[#121212] border border-white/20 rounded-md max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-white font-mono">{selectedOrder.id}</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()} · Tracking #{selectedOrder.trackingNumber}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 text-white/70 hover:text-white border border-white/10 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setOrderDetailModalOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customer & Delivery Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Box */}
              <div className="bg-[#181818] border border-white/15 p-4 rounded-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-[#C4922A] text-xs font-bold uppercase tracking-wider">
                    <User size={14} /> Customer Information
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${selectedOrder.customer.fullName} - ${selectedOrder.customer.phone}`, 'Customer Info')}
                    className="text-[10px] text-white/40 hover:text-[#C4922A] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={11} /> {copiedText === 'Customer Info' ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div>
                  <p className="text-base font-bold text-white tracking-wide">{selectedOrder.customer.fullName}</p>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex items-center justify-between bg-black/40 p-2 rounded-xs border border-white/5">
                    <span className="flex items-center gap-2 text-white/70">
                      <Phone size={13} className="text-emerald-400" /> Phone:
                    </span>
                    <a
                      href={`tel:${selectedOrder.customer.phone}`}
                      className="font-mono font-bold text-emerald-400 hover:underline"
                    >
                      {selectedOrder.customer.phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between bg-black/40 p-2 rounded-xs border border-white/5">
                    <span className="flex items-center gap-2 text-white/70">
                      <Mail size={13} className="text-[#E8B84B]" /> Email:
                    </span>
                    <span className="font-mono text-white/90 text-[11px] truncate max-w-[180px]">
                      {selectedOrder.customer.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address Box */}
              <div className="bg-[#181818] border border-[#C4922A]/40 p-4 rounded-xs space-y-3 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-[#C4922A] text-xs font-bold uppercase tracking-wider">
                    <MapPin size={14} /> Delivery Destination
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${selectedOrder.customer.address}, ${selectedOrder.customer.city}, ${selectedOrder.customer.province}`, 'Address')}
                    className="text-[10px] text-[#C4922A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={11} /> {copiedText === 'Address' ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>

                {/* Prominent Address Callout */}
                <div className="bg-black/60 border border-[#C4922A]/30 p-3 rounded-xs space-y-1">
                  <p className="text-[10px] text-[#C4922A] uppercase font-mono tracking-wider font-semibold">
                    Street / Home Address:
                  </p>
                  <p className="text-sm text-white font-bold leading-relaxed">
                    {selectedOrder.customer.address || 'Address provided at checkout'}
                  </p>
                </div>

                <div className="text-xs text-white/70 space-y-1">
                  <p className="flex justify-between">
                    <span className="text-white/40">City / Town:</span>
                    <strong className="text-white">{selectedOrder.customer.city}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-white/40">Province:</span>
                    <strong className="text-white">{selectedOrder.customer.province}</strong>
                  </p>
                  {selectedOrder.customer.postalCode && (
                    <p className="flex justify-between">
                      <span className="text-white/40">Postal Code:</span>
                      <strong className="text-white font-mono">{selectedOrder.customer.postalCode}</strong>
                    </p>
                  )}
                </div>

                {selectedOrder.customer.deliveryNotes && (
                  <div className="text-[11px] text-amber-200 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xs mt-2">
                    <span className="font-bold uppercase text-[9px] text-amber-400 block mb-0.5">Delivery Notes:</span>
                    "{selectedOrder.customer.deliveryNotes}"
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="border border-white/10 rounded-xs overflow-hidden">
              <div className="bg-[#161616] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">
                  Ordered Pieces ({selectedOrder.items.length})
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  Courier: {selectedOrder.courierPartner || 'Prompt Express'}
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-[#141414]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-black/40 border border-white/10 rounded-xs overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{item.name}</p>
                        <p className="text-[10px] text-white/50 mt-0.5">
                          Size: <strong className="text-white">{item.selectedSize}</strong> | Color: <strong className="text-white">{item.selectedColor}</strong>
                        </p>
                        <p className="text-[10px] text-white/40">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#E8B84B]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="bg-[#181818] p-4 border-t border-white/10 space-y-1.5 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Islandwide Delivery</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE' : `Rs. ${selectedOrder.shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-[#E8B84B]">Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Courier & Tracking Timeline Progress */}
            <div className="bg-[#181818] border border-white/10 p-5 rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#C4922A] flex items-center gap-2">
                  <Truck size={14} /> Live Courier Progress Timeline
                </h4>
                <Link
                  to={`/order-tracking?id=${selectedOrder.id}`}
                  target="_blank"
                  className="text-[11px] text-[#C4922A] hover:underline flex items-center gap-1"
                >
                  Open tracking page <ExternalLink size={11} />
                </Link>
              </div>

              <div className="space-y-3 relative pl-4 border-l-2 border-white/10">
                {selectedOrder.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border ${
                        step.done
                          ? 'bg-[#C4922A] border-[#C4922A] shadow-[0_0_8px_rgba(196,146,42,0.8)]'
                          : 'bg-black/60 border-white/30'
                      }`}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <p className={`text-xs font-semibold ${step.done ? 'text-white' : 'text-white/40'}`}>
                        {step.title}
                      </p>
                      <span className="text-[10px] font-mono text-white/40">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Status Changer & Custom Update Log */}
            <div className="bg-[#181818] border border-[#C4922A]/30 p-5 rounded-xs space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-2">
                <Edit2 size={13} className="text-[#C4922A]" /> Update Order Status &amp; Notify Timeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">New Order Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="w-full bg-[#121212] border border-white/20 text-white text-xs px-3 py-2 rounded-xs outline-none focus:border-[#C4922A]"
                  >
                    <option value="processing">Processing (Under Verification)</option>
                    <option value="confirmed">Confirmed &amp; Quality Checked</option>
                    <option value="shipped">Dispatched with Courier</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered to Customer</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Add Tracking / Courier Note</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adminStatusNote}
                      onChange={e => setAdminStatusNote(e.target.value)}
                      placeholder="e.g. Prompt Express dispatch #54321"
                      className="flex-1 bg-[#121212] border border-white/20 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (adminStatusNote.trim()) {
                          handleStatusChange(selectedOrder.id, selectedOrder.status, adminStatusNote);
                          setAdminStatusNote('');
                        }
                      }}
                      className="btn-gold px-3 py-2 text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Log Note
                    </button>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-2 p-2.5 bg-black/40 border border-white/10 rounded-xs text-[11px] text-white/60 font-mono whitespace-pre-line">
                  {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDeleteOrderId(selectedOrder.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} /> Delete Order Record
              </button>

              <button
                type="button"
                onClick={() => setOrderDetailModalOpen(false)}
                className="btn-gold py-2 px-6 text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Delete Confirmation Modal */}
      {deleteOrderId && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in">
          <div className="bg-[#121212] border border-red-500/40 rounded-md p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Order {deleteOrderId}?</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              This action will permanently remove this order from Firestore Cloud and local history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOrderId(null)}
                className="flex-1 py-2.5 border border-white/20 text-white/70 text-xs uppercase tracking-wider font-semibold hover:text-white rounded-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteOrderId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold rounded-xs shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Delete Product Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in">
          <div className="bg-[#121212] border border-red-500/40 rounded-md p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Product #{deleteConfirmId}?</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              This action will permanently remove this piece from the catalog and the live boutique store.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-white/20 text-white/70 text-xs uppercase tracking-wider font-semibold hover:text-white rounded-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold rounded-xs shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Link Helper Modal */}
      {cloudinaryTesterOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in">
          <div className="bg-[#121212] border border-[#C4922A]/40 rounded-md p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#C4922A]">
                <ImageIcon size={18} />
                <h3 className="text-lg font-bold text-white">Cloudinary Image Link Tester</h3>
              </div>
              <button onClick={() => setCloudinaryTesterOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Paste any Cloudinary direct image URL below to test its visual resolution and verify it displays properly before adding it to a product.
            </p>

            <div className="space-y-3">
              <input
                type="url"
                value={testedUrl}
                onChange={e => setTestedUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                className="w-full bg-[#181818] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs"
              />

              {testedUrl && (
                <div className="border border-white/10 rounded-xs p-4 bg-black/40 flex flex-col items-center">
                  <div className="max-w-[200px] aspect-[3/4] overflow-hidden rounded-xs border border-[#C4922A]/40 mb-3">
                    <img
                      src={testedUrl}
                      alt="Cloudinary Test"
                      className="w-full h-full object-cover"
                      onError={() => alert('Image failed to load. Please verify the Cloudinary link.')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(testedUrl);
                      setCloudinaryCopied(true);
                      setTimeout(() => setCloudinaryCopied(false), 2000);
                    }}
                    className="btn-gold py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {cloudinaryCopied ? <><Check size={13} /> Link Copied</> : 'Copy Valid Link'}
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setCloudinaryTesterOpen(false)}
                className="btn-outline-gold py-2 px-5 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firebase Database Sync Modal */}
      {firebaseModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in">
          <div className="bg-[#121212] border border-white/20 rounded-md p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#C4922A]">
                <Database size={18} />
                <h3 className="text-lg font-bold text-white">Firebase Database Sync</h3>
              </div>
              <button onClick={() => setFirebaseModalOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80 font-semibold">Active Firestore Database:</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> fasion-gate
                </span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Click below to upload/sync all <strong>{products.length}</strong> catalog items directly into Google Firebase Firestore cloud.
              </p>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full btn-gold py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSyncing ? (
                  <><RefreshCw size={14} className="animate-spin text-black" /> Uploading to Firestore Cloud...</>
                ) : manualSyncDone ? (
                  <><Check size={14} /> Cloud Sync Complete!</>
                ) : (
                  <><Database size={14} /> Push All {products.length} Products to Cloud Now</>
                )}
              </button>
            </div>

            <form onSubmit={handleSaveFirebase} className="space-y-3 pt-2 border-t border-white/10">
              <div>
                <label className="block text-[10px] tracking-wider uppercase text-white/60 mb-1">Firebase Project ID</label>
                <input
                  type="text"
                  value={fbConfig.projectId}
                  onChange={e => setFbConfig(c => ({ ...c, projectId: e.target.value }))}
                  placeholder="fasion-gate"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white outline-none focus:border-[#C4922A] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase text-white/60 mb-1">Firebase API Key</label>
                <input
                  type="text"
                  value={fbConfig.apiKey}
                  onChange={e => setFbConfig(c => ({ ...c, apiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white outline-none focus:border-[#C4922A] rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase text-white/60 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={fbConfig.storageBucket}
                  onChange={e => setFbConfig(c => ({ ...c, storageBucket: e.target.value }))}
                  placeholder="fasion-gate.firebasestorage.app"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white outline-none focus:border-[#C4922A] rounded-xs"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    clearStoredFirebaseConfig();
                    setFbConfig(getStoredFirebaseConfig());
                  }}
                  className="text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Reset Config
                </button>
                <button
                  type="submit"
                  className="btn-gold py-2 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {fbSavedStatus ? <><Check size={13} /> Saved!</> : 'Save & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Stock Change Toast */}
      {stockToast && (
        <div
          className={`fixed bottom-6 right-6 z-[150] px-5 py-3 rounded-sm shadow-2xl border flex items-center gap-3 backdrop-blur-md animate-dropdown ${
            stockToast.inStock
              ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100'
              : 'bg-red-950/95 border-red-500/80 text-red-100'
          }`}
        >
          {stockToast.inStock ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-400 shrink-0" />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              {stockToast.inStock ? 'Item In Stock' : 'Item Out of Stock'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">{stockToast.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
