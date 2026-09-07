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
  Copy,
  Building2,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useGallery } from '../../context/GalleryContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Product } from '../../data/products';
import { Order, OrderStatus } from '../../types/order';
import { GalleryItem } from '../../data/gallery';
import { ProductModal } from '../../components/admin/ProductModal';
import { GalleryModal } from '../../components/admin/GalleryModal';
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
    updateStockQuantity,
    resetToDefaults,
    syncAllToCloud,
    isSyncing,
  } = useProducts();

  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const {
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    resetGalleryToDefaults,
  } = useGallery();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  // Top-Level Main Section Tab: 'products' | 'orders' | 'gallery'
  const [mainSection, setMainSection] = useState<'products' | 'orders' | 'gallery'>('products');

  // Products Tab Filter State
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men' | 'kids' | 'accessories' | 'new' | 'outofstock' | 'sale'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Gallery Management State & Filters
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');
  const [gallerySearchQuery, setGallerySearchQuery] = useState<string>('');
  const [galleryViewMode, setGalleryViewMode] = useState<'grid' | 'table'>('grid');
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [deleteGalleryId, setDeleteGalleryId] = useState<number | null>(null);
  const [resetGalleryConfirmOpen, setResetGalleryConfirmOpen] = useState(false);
  const [previewGalleryItem, setPreviewGalleryItem] = useState<GalleryItem | null>(null);

  // Orders State & Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [adminStatusNote, setAdminStatusNote] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewSlip, setPreviewSlip] = useState<{ url: string; name?: string; orderId: string } | null>(null);
  const [slipZoomed, setSlipZoomed] = useState(false);
  const [printableOrder, setPrintableOrder] = useState<Order | null>(null);

  const handlePrintInvoice = (order: Order) => {
    setPrintableOrder(order);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handleDownloadSlip = (url: string, filename?: string) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'Bank_Deposit_Slip.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download error:', e);
      window.open(url, '_blank');
    }
  };

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

  const handleAdjustStock = (id: number, delta: number, currentStock: number, name: string) => {
    const newStock = Math.max(0, currentStock + delta);
    updateStockQuantity(id, newStock);
    setStockToast({
      msg: `"${name}" stock set to ${newStock} units (${delta > 0 ? '+' : ''}${delta})`,
      inStock: newStock > 0,
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
    const totalUnits = products.reduce((acc, curr) => acc + (typeof curr.stockQuantity === 'number' ? curr.stockQuantity : (curr.inStock ? 10 : 0)), 0);
    const lowStockCount = products.filter(p => {
      const qty = typeof p.stockQuantity === 'number' ? p.stockQuantity : (p.inStock ? 10 : 0);
      return qty > 0 && qty <= 5;
    }).length;
    const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);

    return { total, women, men, kids, accessories, inStock, outOfStock, totalUnits, lowStockCount, totalValue };
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

  // Gallery Statistics & Computed Lists
  const galleryStats = useMemo(() => {
    const total = galleryItems.length;
    const campaigns = galleryItems.filter(i => i.tag === 'campaigns').length;
    const craft = galleryItems.filter(i => i.tag === 'craft').length;
    const resortwear = galleryItems.filter(i => i.tag === 'resortwear').length;
    const other = total - (campaigns + craft + resortwear);
    return { total, campaigns, craft, resortwear, other };
  }, [galleryItems]);

  const galleryCategories = useMemo(() => {
    const defaultCats = [
      { id: 'all', label: `All Looks (${galleryItems.length})` },
      { id: 'campaigns', label: `Campaigns (${galleryStats.campaigns})` },
      { id: 'craft', label: `Artisan & Craft (${galleryStats.craft})` },
      { id: 'resortwear', label: `Resortwear (${galleryStats.resortwear})` },
    ];

    const customTags = Array.from(
      new Set(
        galleryItems
          .map(i => i.tag)
          .filter(t => t && !['campaigns', 'craft', 'resortwear'].includes(t))
      )
    );

    const customCats = customTags.map(t => ({
      id: t,
      label: `${t.charAt(0).toUpperCase() + t.slice(1).replace(/[-_]/g, ' ')} (${galleryItems.filter(i => i.tag === t).length})`,
    }));

    return [...defaultCats, ...customCats];
  }, [galleryItems, galleryStats]);

  const filteredGalleryItems = useMemo(() => {
    let list = [...galleryItems];
    if (galleryCategoryFilter !== 'all') {
      list = list.filter(i => i.tag === galleryCategoryFilter);
    }
    if (gallerySearchQuery.trim()) {
      const q = gallerySearchQuery.toLowerCase();
      list = list.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          i.tag.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [galleryItems, galleryCategoryFilter, gallerySearchQuery]);

  const handleOpenAddGallery = () => {
    setEditingGalleryItem(null);
    setGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryModalOpen(true);
  };

  const handleSaveGalleryItem = (data: any) => {
    if (editingGalleryItem) {
      updateGalleryItem(editingGalleryItem.id, data);
    } else {
      addGalleryItem(data);
    }
  };

  const handleDeleteGalleryItem = (id: number) => {
    deleteGalleryItem(id);
    setDeleteGalleryId(null);
  };

  const handleResetGallery = () => {
    resetGalleryToDefaults();
    setResetGalleryConfirmOpen(false);
  };

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
    <>
      <div className="no-print min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
        {/* Top Luxury Admin Header Bar */}
      <header className="bg-[#111111] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-4">
          {/* Brand & Section Switcher */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img src={LOGO_URL} alt="Fashion Gate" className="h-9 sm:h-10 w-auto brightness-0 invert shrink-0 object-contain" />
              <div className="border-l border-white/20 pl-3 hidden sm:block">
                <p className="text-sm font-bold text-white tracking-wider whitespace-nowrap leading-none">FASHION GATE</p>
                <p className="text-[9px] text-[#C4922A] tracking-[0.2em] uppercase font-mono whitespace-nowrap mt-1 leading-none">Administration Hub</p>
              </div>
            </Link>

            {/* Main Section Navigation Switcher */}
            <div className="flex items-center bg-black/60 border border-white/15 p-1 rounded-sm shrink-0 h-9">
              <button
                type="button"
                onClick={() => setMainSection('products')}
                className={`flex items-center justify-center gap-2 px-3.5 h-full rounded-xs text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  mainSection === 'products'
                    ? 'bg-[#C4922A] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={14} className="shrink-0" />
                <span className="whitespace-nowrap leading-none">Products ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMainSection('orders')}
                className={`flex items-center justify-center gap-2 px-3.5 h-full rounded-xs text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer relative whitespace-nowrap shrink-0 ${
                  mainSection === 'orders'
                    ? 'bg-[#C4922A] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShoppingBag size={14} className="shrink-0" />
                <span className="whitespace-nowrap leading-none">Orders ({orders.length})</span>
                {orderStats.processing > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMainSection('gallery')}
                className={`flex items-center justify-center gap-2 px-3.5 h-full rounded-xs text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer relative whitespace-nowrap shrink-0 ${
                  mainSection === 'gallery'
                    ? 'bg-[#C4922A] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ImageIcon size={14} className="shrink-0" />
                <span className="whitespace-nowrap leading-none">Gallery ({galleryItems.length})</span>
              </button>
            </div>
          </div>

          {/* Quick Action Tools & Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-end">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 h-9 text-[11px] uppercase tracking-wider text-white/70 hover:text-white border border-white/15 hover:border-[#C4922A] bg-black/40 hover:bg-white/5 rounded-xs transition-colors whitespace-nowrap shrink-0"
              title="Open Live Boutique Store"
            >
              <ExternalLink size={13} className="shrink-0 text-white/60" />
              <span className="whitespace-nowrap">Live Store</span>
            </Link>

            {/* Cloudinary Link Tool */}
            <button
              onClick={() => setCloudinaryTesterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-9 text-[11px] uppercase tracking-wider text-[#E8B84B] bg-[#C4922A]/10 border border-[#C4922A]/40 rounded-xs hover:bg-[#C4922A]/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Open Cloudinary Image Link Helper"
            >
              <ImageIcon size={13} className="shrink-0 text-[#C4922A]" />
              <span className="whitespace-nowrap">Cloudinary Tool</span>
            </button>

            {/* Firebase Config */}
            <button
              onClick={() => setFirebaseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-9 text-[11px] uppercase tracking-wider text-white/70 hover:text-white border border-white/15 hover:border-[#C4922A] bg-black/40 hover:bg-white/5 rounded-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Firebase Cloud Config & Sync"
            >
              <Database size={13} className="shrink-0 text-white/60" />
              <span className="whitespace-nowrap">Firebase Config</span>
            </button>

            {/* Tab-specific primary action button */}
            {mainSection === 'products' ? (
              <button
                onClick={handleOpenAdd}
                className="btn-gold h-9 px-3.5 text-xs tracking-wider uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap shrink-0"
              >
                <Plus size={15} className="shrink-0" />
                <span className="whitespace-nowrap">Add New Piece</span>
              </button>
            ) : mainSection === 'orders' ? (
              <Link
                to="/order-tracking"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs uppercase tracking-wider font-bold bg-[#C4922A] text-white border border-[#C4922A] rounded-xs hover:bg-[#d49f33] transition-all cursor-pointer shadow-md whitespace-nowrap shrink-0"
              >
                <Truck size={14} className="shrink-0" />
                <span className="whitespace-nowrap">Tracking Portal</span>
              </Link>
            ) : (
              <button
                onClick={handleOpenAddGallery}
                className="btn-gold h-9 px-3.5 text-xs tracking-wider uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap shrink-0"
              >
                <Plus size={15} className="shrink-0" />
                <span className="whitespace-nowrap">Add Gallery Look</span>
              </button>
            )}

            {/* Balanced Sign Out Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 h-9 text-[11px] font-semibold uppercase tracking-wider text-red-400/90 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 hover:border-red-500/60 rounded-xs transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs active:scale-95"
              title="Sign Out of Admin Portal"
            >
              <LogOut size={13} className="shrink-0 text-red-400" />
              <span className="whitespace-nowrap">Sign Out</span>
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
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Total Catalog</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stats.total}</p>
                <p className="text-[10px] text-[#C4922A] tracking-wider uppercase mt-1">Active Styles</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Total Stock Units</p>
                <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.totalUnits}</p>
                <p className="text-[10px] text-emerald-400/70 tracking-wider uppercase mt-1">Units In Warehouse</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Low Stock Alerts</p>
                <p className={`text-3xl font-extrabold tracking-tight ${stats.lowStockCount > 0 ? 'text-amber-400 animate-pulse' : 'text-white/60'}`}>
                  {stats.lowStockCount}
                </p>
                <p className="text-[10px] text-amber-400/80 tracking-wider uppercase mt-1">≤ 5 Units Left</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Women's</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{stats.women}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Dresses &amp; Sarees</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Men's</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{stats.men}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Shirts &amp; Blazers</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Kids &amp; Acc</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{stats.kids + stats.accessories}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Kids &amp; Accessories</p>
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
                <div className="flex flex-wrap items-center gap-1.5">
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
                      className={`px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase font-semibold transition-all rounded-xs cursor-pointer whitespace-nowrap shrink-0 ${
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
                        <th className="py-4 px-4 text-center">Warehouse Stock</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredProducts.map(product => {
                        const stockQty = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 10 : 0);
                        const isOOS = !product.inStock || stockQty <= 0;
                        const isLow = !isOOS && stockQty <= 5;

                        return (
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

                            {/* Real-time Inventory Stock & +/- Adjuster */}
                            <td className="py-4 px-4 text-center">
                              <div className="flex flex-col items-center gap-1.5 min-w-[150px]">
                                {/* Badge indicator */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStock(product.id, product.inStock, product.name)}
                                    title="Click to toggle In-Stock / Out-of-Stock"
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-xs border cursor-pointer hover:opacity-80 transition-opacity ${
                                      isOOS
                                        ? 'border-red-500/50 bg-red-500/15 text-red-400'
                                        : isLow
                                        ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 animate-pulse'
                                        : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                                    }`}
                                  >
                                    {isOOS ? (
                                      <><XCircle size={11} /> 0 Units (Out)</>
                                    ) : isLow ? (
                                      <><AlertCircle size={11} /> Low ({stockQty})</>
                                    ) : (
                                      <><CheckCircle2 size={11} /> {stockQty} In Stock</>
                                    )}
                                  </button>
                                </div>

                                {/* Inline Quick +/- Stepper Controls */}
                                <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xs px-1 py-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustStock(product.id, -1, stockQty, product.name)}
                                    disabled={stockQty <= 0}
                                    className="w-5 h-5 flex items-center justify-center text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 rounded-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                    title="Decrease stock by 1"
                                  >
                                    -
                                  </button>
                                  <span className="text-[11px] font-mono font-bold text-white px-1.5 min-w-[26px] text-center">
                                    {stockQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustStock(product.id, 1, stockQty, product.name)}
                                    className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#E8B84B] hover:text-white hover:bg-[#C4922A]/30 rounded-xs cursor-pointer transition-colors"
                                    title="Increase stock by 1"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustStock(product.id, 5, stockQty, product.name)}
                                    className="text-[9px] font-bold text-[#C4922A] px-1 hover:bg-[#C4922A]/20 rounded-xs transition-colors cursor-pointer"
                                    title="Add 5 units to stock"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => {
                  const stockQty = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 10 : 0);
                  const isOOS = !product.inStock || stockQty <= 0;
                  const isLow = !isOOS && stockQty <= 5;

                  return (
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
                        <span
                          className={`absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-xs border backdrop-blur-xs shadow-md ${
                            isOOS
                              ? 'bg-red-950/90 border-red-500 text-red-300'
                              : isLow
                              ? 'bg-amber-950/90 border-amber-500 text-amber-300 animate-pulse'
                              : 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                          }`}
                        >
                          {isOOS ? 'Out of Stock' : `${stockQty} Units`}
                        </span>
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

                        <div className="space-y-2.5 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-[#E8B84B]">Rs. {product.price.toLocaleString()}</p>
                              {product.originalPrice && (
                                <p className="text-[10px] text-white/30 line-through">
                                  Rs. {product.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>

                            {/* Quick +/- Stepper in Grid Card */}
                            <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xs px-1.5 py-0.5">
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(product.id, -1, stockQty, product.name)}
                                disabled={stockQty <= 0}
                                className="w-4 h-4 flex items-center justify-center text-xs font-bold text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                                title="Decrease stock by 1"
                              >
                                -
                              </button>
                              <span className="text-[10px] font-mono font-bold text-white px-1">
                                {stockQty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(product.id, 1, stockQty, product.name)}
                                className="w-4 h-4 flex items-center justify-center text-xs font-bold text-[#C4922A] hover:text-white cursor-pointer"
                                title="Increase stock by 1"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1.5">
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
                  );
                })}
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
                <div className="flex flex-wrap items-center gap-1.5">
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
                      className={`px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase font-semibold transition-all rounded-xs cursor-pointer whitespace-nowrap shrink-0 ${
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
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-white/10 rounded-xs text-white/70">
                                  {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'card' ? 'CARD' : 'BANK TRANSFER'}
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
                              {order.paymentMethod === 'bank_transfer' && (
                                order.bankReceipt ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewSlip({ url: order.bankReceipt!, name: order.bankReceiptName, orderId: order.id })}
                                    className="text-[9px] font-bold text-[#E8B84B] bg-[#C4922A]/20 hover:bg-[#C4922A]/35 border border-[#C4922A]/50 px-2 py-0.5 rounded-xs inline-flex items-center gap-1.5 mt-1 cursor-pointer transition-colors shadow-xs"
                                    title="Click to view bank deposit slip"
                                  >
                                    <Check size={10} className="text-emerald-400" />
                                    <span>Slip Attached</span>
                                    <Eye size={10} className="text-[#C4922A]" />
                                  </button>
                                ) : (
                                  <span className="text-[9px] font-medium text-amber-400/80 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded-xs inline-flex items-center gap-1 mt-1">
                                    No Slip
                                  </span>
                                )
                              )}
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
                                  onClick={() => handlePrintInvoice(order)}
                                  className="p-1.5 text-[#E8B84B] hover:text-black hover:bg-[#C4922A] border border-[#C4922A]/40 rounded-xs transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-xs"
                                  title="Print Official Order Invoice"
                                >
                                  <Printer size={13} />
                                  <span className="hidden sm:inline">Print</span>
                                </button>
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

        {/* =========================================================================
            SECTION 3: GALLERY MANAGEMENT VIEW
            ========================================================================= */}
        {mainSection === 'gallery' && (
          <div className="space-y-8 animate-fade-in">
            {/* Gallery KPI Metrics */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Total Looks</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{galleryStats.total}</p>
                <p className="text-[10px] text-[#C4922A] tracking-wider uppercase mt-1">Live Photography</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Campaigns</p>
                <p className="text-3xl font-extrabold text-[#E8B84B] tracking-tight">{galleryStats.campaigns}</p>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">Seasonal Lookbooks</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Artisan &amp; Craft</p>
                <p className="text-3xl font-extrabold text-blue-400 tracking-tight">{galleryStats.craft}</p>
                <p className="text-[10px] text-blue-400/70 tracking-wider uppercase mt-1">Handloom &amp; Batik</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Resortwear</p>
                <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">{galleryStats.resortwear}</p>
                <p className="text-[10px] text-emerald-400/70 tracking-wider uppercase mt-1">Island Silhouettes</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm">
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Custom Tags</p>
                <p className="text-3xl font-extrabold text-purple-400 tracking-tight">{galleryStats.other}</p>
                <p className="text-[10px] text-purple-400/70 tracking-wider uppercase mt-1">Editorial / Runway</p>
              </div>

              <div className="bg-[#121212] border border-white/10 p-4 rounded-sm flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-mono mb-1">Public Gallery</p>
                  <p className="text-xs font-semibold text-white">Live Editorial Page</p>
                </div>
                <Link
                  to="/gallery"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#C4922A]/15 hover:bg-[#C4922A]/30 border border-[#C4922A]/40 text-[#E8B84B] rounded-xs text-[11px] font-bold uppercase tracking-wider transition-colors mt-2"
                >
                  <ExternalLink size={12} /> View Page
                </Link>
              </div>
            </section>

            {/* Gallery Toolbar: Search, Filters & Action Buttons */}
            <section className="bg-[#121212] border border-white/10 p-4 rounded-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {galleryCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setGalleryCategoryFilter(cat.id)}
                      className={`px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase font-semibold transition-all rounded-xs cursor-pointer whitespace-nowrap shrink-0 ${
                        galleryCategoryFilter === cat.id
                          ? 'bg-[#C4922A] text-white shadow-sm font-bold'
                          : 'border border-white/10 text-white/60 hover:text-white hover:border-white/25 bg-black/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Right side controls: View Mode toggle & Reset Defaults */}
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-xs p-0.5">
                    <button
                      onClick={() => setGalleryViewMode('grid')}
                      className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                        galleryViewMode === 'grid' ? 'bg-[#C4922A] text-white' : 'text-white/40 hover:text-white'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      onClick={() => setGalleryViewMode('table')}
                      className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                        galleryViewMode === 'table' ? 'bg-[#C4922A] text-white' : 'text-white/40 hover:text-white'
                      }`}
                      title="Table View"
                    >
                      <List size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => setResetGalleryConfirmOpen(true)}
                    className="px-3 py-1.5 border border-white/10 hover:border-white/20 bg-black/30 text-white/60 hover:text-white rounded-xs text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Reset gallery photos to default 9 items"
                  >
                    <RefreshCw size={12} />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleOpenAddGallery}
                    className="btn-gold py-1.5 px-3.5 text-xs uppercase tracking-wider font-bold rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus size={14} /> Add Look
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="relative w-full sm:max-w-md">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={gallerySearchQuery}
                    onChange={e => setGallerySearchQuery(e.target.value)}
                    placeholder="Search gallery by title, subtitle, category or story..."
                    className="w-full bg-[#181818] border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                  />
                  {gallerySearchQuery && (
                    <button
                      onClick={() => setGallerySearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/40 self-start sm:self-center font-mono">
                  Showing <strong className="text-white">{filteredGalleryItems.length}</strong> of {galleryItems.length} looks
                </p>
              </div>
            </section>

            {/* Content Display: Empty, Grid or Table */}
            {filteredGalleryItems.length === 0 ? (
              <div className="bg-[#121212] border border-white/10 rounded-sm p-16 text-center space-y-4">
                <ImageIcon size={44} className="mx-auto text-white/20" />
                <h3 className="text-2xl font-bold text-white">No Gallery Looks Found</h3>
                <p className="text-sm text-white/50 max-w-md mx-auto">
                  {gallerySearchQuery || galleryCategoryFilter !== 'all'
                    ? 'No editorial photos match your search keyword or selected category filter.'
                    : 'Your gallery is currently empty. Click below to add your first campaign photo.'}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  {(gallerySearchQuery || galleryCategoryFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setGallerySearchQuery('');
                        setGalleryCategoryFilter('all');
                      }}
                      className="px-4 py-2 border border-white/20 text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:border-[#C4922A]"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={handleOpenAddGallery}
                    className="btn-gold py-2 px-5 text-xs uppercase tracking-wider font-bold rounded-xs flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add New Photo
                  </button>
                </div>
              </div>
            ) : galleryViewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGalleryItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#121212] border border-white/10 hover:border-[#C4922A]/60 rounded-sm overflow-hidden transition-all group flex flex-col justify-between shadow-lg"
                  >
                    {/* Top Image Preview Card */}
                    <div>
                      <div className="relative aspect-[3/4] bg-black overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md text-[#E8B84B] border border-[#C4922A]/40 text-[9px] uppercase font-bold tracking-wider rounded-xs shadow-md">
                            {item.tag}
                          </span>
                          <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md text-white/80 border border-white/15 text-[9px] font-mono rounded-xs shadow-md">
                            {item.aspect === 'aspect-[3/4]' ? '3:4 Portrait' : item.aspect === 'aspect-square' ? '1:1 Square' : '4:3 Landscape'}
                          </span>
                        </div>

                        {/* Hover Overlay Buttons */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                          <button
                            type="button"
                            onClick={() => setPreviewGalleryItem(item)}
                            className="p-2.5 bg-white/15 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
                            title="Preview Full Image"
                          >
                            <ZoomIn size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditGallery(item)}
                            className="p-2.5 bg-[#C4922A] hover:bg-[#d49f33] text-white rounded-full transition-all cursor-pointer shadow-lg"
                            title="Edit Look Details"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteGalleryId(item.id)}
                            className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer shadow-lg"
                            title="Delete Photo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2">
                        <p className="text-[10px] text-[#C4922A] uppercase font-semibold tracking-widest truncate">
                          {item.subtitle}
                        </p>
                        <h4 className="font-display text-base font-bold text-white leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-3 bg-[#161616] border-t border-white/5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-white/40 font-mono">ID #{item.id}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditGallery(item)}
                          className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteGalleryId(item.id)}
                          className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xs transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#161616] text-[10px] tracking-[0.15em] uppercase text-white/60 font-semibold">
                        <th className="py-4 px-4 w-24">Photo</th>
                        <th className="py-4 px-4 min-w-[220px]">Title &amp; Subtitle</th>
                        <th className="py-4 px-4">Category Tag</th>
                        <th className="py-4 px-4">Aspect Ratio</th>
                        <th className="py-4 px-4 min-w-[250px]">Editorial Story</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredGalleryItems.map(item => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <div
                              onClick={() => setPreviewGalleryItem(item)}
                              className="w-14 h-16 bg-black rounded-xs overflow-hidden border border-white/15 cursor-pointer relative group"
                            >
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ZoomIn size={12} className="text-white" />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-white text-xs">{item.title}</p>
                            <p className="text-[10px] text-[#C4922A] uppercase tracking-wider mt-0.5">{item.subtitle}</p>
                            <span className="text-[9px] text-white/30 font-mono">Ref #{item.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs bg-[#C4922A]/15 border border-[#C4922A]/30 text-[#E8B84B]">
                              {item.tag}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs font-mono text-white/70">
                              {item.aspect === 'aspect-[3/4]' ? '3:4 Portrait' : item.aspect === 'aspect-square' ? '1:1 Square' : '4:3 Landscape'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-xs text-white/60 line-clamp-2 max-w-sm">
                              {item.description || '—'}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewGalleryItem(item)}
                                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
                                title="Zoom Preview"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditGallery(item)}
                                className="p-1.5 text-[#C4922A] hover:text-white hover:bg-[#C4922A] rounded-xs transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteGalleryId(item.id)}
                                className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xs transition-colors cursor-pointer"
                                title="Delete"
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
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="btn-gold py-1.5 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Print Official Order Invoice"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <Link
                  to={`/order-confirmation/${selectedOrder.id}`}
                  target="_blank"
                  className="p-2 text-white/70 hover:text-white border border-white/10 rounded-xs transition-colors text-xs font-semibold flex items-center gap-1"
                  title="Open Full Page Invoice in New Tab"
                >
                  <ExternalLink size={13} /> View Full
                </Link>
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
                  <div className="flex items-center justify-between gap-3 bg-black/40 p-2.5 rounded-xs border border-white/5">
                    <span className="flex items-center gap-2 text-white/50 text-[11px] font-medium shrink-0">
                      <Phone size={13} className="text-emerald-400" /> Phone:
                    </span>
                    <a
                      href={`tel:${selectedOrder.customer.phone}`}
                      className="font-mono font-bold text-emerald-400 hover:underline text-right"
                    >
                      {selectedOrder.customer.phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-black/40 p-2.5 rounded-xs border border-white/5">
                    <span className="flex items-center gap-2 text-white/50 text-[11px] font-medium shrink-0">
                      <Mail size={13} className="text-[#E8B84B]" /> Email:
                    </span>
                    <span className="font-mono text-white/90 text-xs truncate text-right">
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
                  <p className="text-sm text-white font-bold leading-relaxed break-words">
                    {selectedOrder.customer.address || 'Address provided at checkout'}
                  </p>
                </div>

                {/* City, Province, Postal Code Rows */}
                <div className="bg-black/40 border border-white/5 rounded-xs px-3 py-2 text-xs divide-y divide-white/5">
                  <div className="flex items-start justify-between gap-3 py-1.5">
                    <span className="text-white/40 text-[11px] font-medium shrink-0">City / Town:</span>
                    <strong className="text-white font-semibold text-right capitalize">{selectedOrder.customer.city}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-3 py-1.5">
                    <span className="text-white/40 text-[11px] font-medium shrink-0">Province:</span>
                    <strong className="text-white font-semibold text-right leading-snug break-words flex-1">{selectedOrder.customer.province}</strong>
                  </div>
                  {selectedOrder.customer.postalCode && (
                    <div className="flex items-start justify-between gap-3 py-1.5">
                      <span className="text-white/40 text-[11px] font-medium shrink-0">Postal Code:</span>
                      <strong className="text-white font-mono font-semibold text-right">{selectedOrder.customer.postalCode}</strong>
                    </div>
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

            {/* Bank Transfer Receipt Slip Section */}
            {selectedOrder.paymentMethod === 'bank_transfer' && (
              <div className="bg-[#181818] border border-[#C4922A]/50 p-4 rounded-xs space-y-3 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-[#C4922A] text-xs font-bold uppercase tracking-wider">
                    <Building2 size={14} /> Bank Transfer Deposit Slip
                  </div>
                  {selectedOrder.bankReceipt && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Receipt Uploaded by Customer
                    </span>
                  )}
                </div>

                {selectedOrder.bankReceipt ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/60 p-3.5 rounded-xs border border-[#C4922A]/30">
                    <div
                      onClick={() => setPreviewSlip({ url: selectedOrder.bankReceipt!, name: selectedOrder.bankReceiptName, orderId: selectedOrder.id })}
                      className="w-28 h-36 bg-black/80 border border-[#C4922A]/60 rounded-xs overflow-hidden shrink-0 flex items-center justify-center group relative cursor-pointer shadow-md"
                    >
                      {selectedOrder.bankReceipt.startsWith('data:image') || selectedOrder.bankReceipt.startsWith('http') ? (
                        <>
                          <img src={selectedOrder.bankReceipt} alt="Deposit Slip" className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider transition-opacity gap-1">
                            <ZoomIn size={18} className="text-[#E8B84B]" />
                            <span>Preview</span>
                          </div>
                        </>
                      ) : (
                        <FileText size={32} className="text-[#C4922A]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2.5 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-xs">
                            Verified Upload
                          </span>
                          <span className="text-white/40 text-[10px]">
                            Order Ref: <strong className="text-white font-mono">{selectedOrder.id}</strong>
                          </span>
                        </div>
                        <p className="text-white font-bold text-sm truncate mt-1">
                          {selectedOrder.bankReceiptName || 'Customer_Bank_Deposit_Slip.jpg'}
                        </p>
                        <p className="text-white/50 text-[11px] mt-0.5">
                          Bank: <strong className="text-white/80">Commercial Bank / Sampath Bank</strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewSlip({ url: selectedOrder.bankReceipt!, name: selectedOrder.bankReceiptName, orderId: selectedOrder.id })}
                          className="btn-gold py-1.5 px-3.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Eye size={13} /> View Full Receipt
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSlip(selectedOrder.bankReceipt!, selectedOrder.bankReceiptName || `FG-Receipt-${selectedOrder.id}.jpg`)}
                          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download size={13} /> Download Slip
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-400/90 bg-amber-950/30 p-3.5 rounded-xs border border-amber-500/30 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                      No receipt slip was uploaded for this order.
                    </p>
                    <p className="text-[11px] text-white/60">
                      Customer placed this order using Bank Transfer option. You may contact the customer at <strong className="text-white">{selectedOrder.customer.phone}</strong> to request the transfer receipt before confirming shipment.
                    </p>
                  </div>
                )}
              </div>
            )}

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
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDeleteOrderId(selectedOrder.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} /> Delete Order Record
              </button>

              <div className="flex items-center gap-2.5">
                <Link
                  to={`/order-confirmation/${selectedOrder.id}`}
                  target="_blank"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink size={13} /> Open Invoice Page
                </Link>
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="btn-gold py-2 px-4 text-xs uppercase tracking-wider font-bold cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <Printer size={14} /> Print Boutique Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setOrderDetailModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-white/70 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
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

      {/* Gallery Add/Edit Modal */}
      <GalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onSave={handleSaveGalleryItem}
        item={editingGalleryItem}
      />

      {/* Delete Gallery Item Confirmation Modal */}
      {deleteGalleryId !== null && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in">
          <div className="bg-[#121212] border border-red-500/40 rounded-md p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Gallery Photo #{deleteGalleryId}?</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              This action will remove this photograph from both the admin dashboard and the live public editorial gallery.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteGalleryId(null)}
                className="flex-1 py-2.5 border border-white/20 text-white/70 text-xs uppercase tracking-wider font-semibold hover:text-white rounded-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGalleryItem(deleteGalleryId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold rounded-xs shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Gallery to Defaults Confirmation Modal */}
      {resetGalleryConfirmOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-scale-in">
          <div className="bg-[#121212] border border-amber-500/40 rounded-md p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reset Gallery to Defaults?</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              This will restore the original curated 9 editorial campaign &amp; craft photos. Any custom photos added will be replaced.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setResetGalleryConfirmOpen(false)}
                className="flex-1 py-2.5 border border-white/20 text-white/70 text-xs uppercase tracking-wider font-semibold hover:text-white rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetGallery}
                className="btn-gold flex-1 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xs shadow-md cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Zoom / Preview Modal */}
      {previewGalleryItem && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-scale-in">
          <div className="bg-[#121212] border border-[#C4922A]/40 rounded-md max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
              <div>
                <p className="text-[10px] text-[#C4922A] uppercase font-mono tracking-widest">{previewGalleryItem.subtitle}</p>
                <h3 className="text-base font-bold text-white font-display">{previewGalleryItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewGalleryItem(null)}
                className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-xs cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-black/80 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={previewGalleryItem.image}
                alt={previewGalleryItem.title}
                className="max-h-[55vh] w-auto object-contain rounded-xs border border-white/10"
              />
            </div>

            <div className="p-4 bg-[#141414] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#C4922A]/20 text-[#E8B84B] font-bold text-[10px] uppercase rounded-xs">
                    {previewGalleryItem.tag}
                  </span>
                  <span className="text-white/40 font-mono text-[10px]">{previewGalleryItem.aspect}</span>
                </div>
                {previewGalleryItem.description && (
                  <p className="text-white/60 text-xs italic max-w-md">"{previewGalleryItem.description}"</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditGallery(previewGalleryItem);
                    setPreviewGalleryItem(null);
                  }}
                  className="btn-gold py-1.5 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={13} /> Edit Look
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewGalleryItem(null)}
                  className="px-3.5 py-1.5 border border-white/20 text-white/70 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
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

      {/* Fullscreen Bank Transfer Slip Lightbox Modal */}
      {previewSlip && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-fade-in"
          onClick={() => {
            setPreviewSlip(null);
            setSlipZoomed(false);
          }}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between bg-[#141414]/90 border border-white/10 rounded-sm px-4 py-3 shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-[#C4922A]/20 border border-[#C4922A]/50 flex items-center justify-center text-[#E8B84B]">
                <Building2 size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-xs md:text-sm font-bold tracking-wide">
                    Bank Deposit Slip
                  </h3>
                  <span className="text-[10px] font-mono bg-[#C4922A]/20 text-[#E8B84B] px-1.5 py-0.5 rounded-xs">
                    {previewSlip.orderId}
                  </span>
                </div>
                <p className="text-white/40 text-[11px] truncate max-w-xs md:max-w-md">
                  {previewSlip.name || 'Deposit_Slip.jpg'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlipZoomed(z => !z)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title={slipZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {slipZoomed ? <><ZoomOut size={13} /> Fit Screen</> : <><ZoomIn size={13} /> Zoom 100%</>}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSlip(previewSlip.url, previewSlip.name || `FG-Receipt-${previewSlip.orderId}.jpg`)}
                className="btn-gold py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} /> Download
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewSlip(null);
                  setSlipZoomed(false);
                }}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xs transition-colors cursor-pointer ml-1"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Central Image Viewer Container */}
          <div
            className="flex-1 flex items-center justify-center p-2 md:p-6 overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className={`relative transition-all duration-200 ${slipZoomed ? 'max-w-none' : 'max-w-4xl max-h-[75vh]'}`}>
              <img
                src={previewSlip.url}
                alt="Bank Transfer Receipt"
                className={`rounded-xs border border-[#C4922A]/40 shadow-2xl object-contain mx-auto ${
                  slipZoomed ? 'w-auto max-w-none' : 'max-h-[75vh] w-auto'
                }`}
              />
            </div>
          </div>

          {/* Bottom Bar Info */}
          <div
            className="text-center text-[11px] text-white/40 pt-2 shrink-0"
            onClick={e => e.stopPropagation()}
          >
            Verified Customer Upload • Fashion Gate Boutique Accounts Department
          </div>
        </div>
      )}
    </div>

      {/* =========================================================================
          DEDICATED PRINTABLE OFFICIAL BOUTIQUE INVOICE (ONLY VISIBLE ON PRINT)
          ========================================================================= */}
      {(printableOrder || selectedOrder) && (() => {
        const targetOrder = printableOrder || selectedOrder!;
        return (
          <div className="print-only w-full bg-white text-black text-xs font-sans p-2">
            {/* Official Boutique Header with Real Logo */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E8E4DF]">
              <div className="flex items-center gap-3.5">
                <img
                  src={LOGO_URL}
                  alt="Fashion Gate"
                  className="h-12 w-auto object-contain shrink-0"
                />
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0A0A0A] tracking-wider uppercase">
                    FASHION GATE
                  </h2>
                  <p className="text-[10px] text-[#7A7A7A] tracking-wider uppercase font-medium">
                    Official Boutique Order Invoice
                  </p>
                </div>
              </div>
              <div className="text-right text-[10.5px] text-[#7A7A7A] space-y-0.5">
                <p className="font-mono text-[#0A0A0A] font-bold">Hotline: +94 70 773 9962</p>
                <p>Colombo 07, Sri Lanka • www.fashiongate.lk</p>
                <p className="font-mono text-[10px]">
                  Date: {new Date(targetOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Order Reference & Delivery Date Row */}
            <div className="flex items-center justify-between py-3 border-b border-[#E8E4DF] gap-2">
              <div>
                <p className="text-[10px] text-[#9E9E9E] uppercase tracking-wider font-semibold">ORDER REFERENCE</p>
                <h3 className="font-mono text-base font-bold text-[#0A0A0A]">{targetOrder.id}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#9E9E9E] uppercase tracking-wider font-semibold">ESTIMATED DELIVERY</p>
                <p className="text-xs font-bold text-[#C4922A] flex items-center gap-1 justify-end">
                  <Clock size={13} /> {targetOrder.estimatedDelivery || 'Within 2 - 3 Business Days'}
                </p>
              </div>
            </div>

            {/* Delivery & Payment Details Card Box */}
            <div className="grid grid-cols-2 gap-4 p-4 my-3 bg-[#FAFAF8] rounded-xs border border-[#E8E4DF] text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-[#C4922A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#C4922A]" /> DELIVERY DESTINATION
                </p>
                <p className="font-bold text-[#0A0A0A] text-sm">{targetOrder.customer.fullName}</p>
                <p className="text-[#4A4A4A] leading-relaxed">{targetOrder.customer.address}, {targetOrder.customer.city}</p>
                <p className="text-[#4A4A4A]">{targetOrder.customer.province}</p>
                <p className="text-[#4A4A4A] font-mono font-semibold">{targetOrder.customer.phone}</p>
              </div>

              <div className="space-y-1 border-l border-[#E8E4DF] pl-4">
                <p className="text-[10px] text-[#C4922A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Truck size={13} className="text-[#C4922A]" /> PAYMENT DETAILS
                </p>
                <p className="font-bold text-[#0A0A0A] uppercase">
                  {targetOrder.paymentMethod === 'cod'
                    ? 'CASH ON DELIVERY (COD)'
                    : targetOrder.paymentMethod === 'card'
                    ? 'ONLINE CARD PAYMENT'
                    : 'DIRECT BANK TRANSFER'}
                </p>
                {targetOrder.paymentMethod === 'bank_transfer' && targetOrder.bankReceipt && (
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={11} /> Transfer Slip Attached &amp; Verified
                  </p>
                )}
                <p className="text-[11px] text-[#7A7A7A]">
                  Courier: <span className="text-[#0A0A0A] font-medium">{targetOrder.courierPartner || 'Prompt Express (Islandwide Delivery)'}</span>
                </p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="my-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2.5">
                ITEMS ORDERED ({targetOrder.items.reduce((s, i) => s + i.quantity, 0)})
              </h4>
              <div className="divide-y divide-[#E8E4DF]">
                {targetOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-16 object-cover bg-[#F2F0ED] rounded-xs shrink-0 border border-[#E8E4DF]"
                      />
                      <div>
                        <h5 className="font-semibold text-xs text-[#0A0A0A]">{item.name}</h5>
                        <p className="text-[10.5px] text-[#7A7A7A] mt-0.5">
                          Qty: {item.quantity} · Size: <span className="font-bold text-[#0A0A0A]">{item.selectedSize}</span>
                          {item.selectedColor && <> · <span className="text-[#0A0A0A]">{item.selectedColor}</span></>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#0A0A0A]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#9E9E9E]">Rs. {item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="pt-3 border-t border-[#E8E4DF] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7A7A7A]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0A0A0A]">Rs. {targetOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#7A7A7A]">
                <span>Delivery / Shipping</span>
                <span className="font-semibold text-[#0A0A0A]">
                  {targetOrder.shipping === 0 ? 'Rs. 350' : `Rs. ${targetOrder.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E4DF]">
                <span className="font-bold uppercase tracking-wider text-[#0A0A0A]">TOTAL AMOUNT</span>
                <span className="font-display text-xl font-bold text-[#C4922A]">
                  Rs. {targetOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Print Footer */}
            <div className="mt-4 pt-3 border-t border-black/20 text-center text-[9px] text-[#555] space-y-0.5">
              <p className="font-semibold text-black">
                Thank you for shopping with Fashion Gate. Quote Order Key #{targetOrder.id} for any courier or exchange inquiries.
              </p>
              <p>
                Colombo 07, Sri Lanka • Hotline: +94 70 773 9962 • www.fashiongate.lk
              </p>
            </div>
          </div>
        );
      })()}
    </>
  );
}
