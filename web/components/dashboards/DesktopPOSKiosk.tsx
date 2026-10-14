'use client';

import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Wifi,
  WifiOff,
  RefreshCw,
  Printer,
  Maximize2,
  Minimize2,
  Scan,
  Barcode,
  Search,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  CreditCard,
  DollarSign,
  Package,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface LocalMember {
  id: string;
  name: string;
  phone: string;
  membership_status: string;
  qr_secret: string;
  valid_until: string;
  plan: string;
}

interface LocalProduct {
  id: string;
  title: string;
  barcode: string;
  price: number;
  stock_quantity: number;
}

interface CartItem {
  product: LocalProduct;
  quantity: number;
}

export const DesktopPOSKiosk: React.FC = () => {
  const [isDesktopEnv, setIsDesktopEnv] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncAlert, setSyncAlert] = useState<string | null>(null);

  // Search & Hardware scanner inputs
  const [scannerInput, setScannerInput] = useState('');
  const [scannedMember, setScannedMember] = useState<LocalMember | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<{ success: boolean; message: string; isOffline?: boolean } | null>(null);

  // Products & Cart
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);
  const [cart, setCart] = useState<{ [id: string]: CartItem }>({});
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [drawerAlert, setDrawerAlert] = useState<string | null>(null);

  // Detect Electron IPC Bridge
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).pulsopsPOS) {
      setIsDesktopEnv(true);
      const api = (window as any).pulsopsPOS;

      // Get initial sync status
      api.getSyncStatus().then((st: any) => {
        setIsOnline(st.isOnline);
        setPendingSyncCount(st.pendingCount);
      });

      // Load SQLite cached products
      api.getAllLocalProducts().then((prods: LocalProduct[]) => {
        if (prods && prods.length) setLocalProducts(prods);
      });

      // Subscribe to sync status updates
      const unsubSync = api.onSyncStatusChanged((status: any) => {
        setIsOnline(status.isOnline);
        setPendingSyncCount(status.pendingCount);
      });

      // Subscribe to hardware barcode/QR scanner
      const unsubScanner = api.onBarcodeScanned((code: string) => {
        handleProcessBarcodeOrQR(code);
      });

      return () => {
        if (unsubSync) unsubSync();
        if (unsubScanner) unsubScanner();
      };
    } else {
      // Fallback web simulation data
      setLocalProducts([
        { id: 'p-1', title: 'أوبتيموم جولد واي بروتين 5 باوند', barcode: '6221001001', price: 3950, stock_quantity: 34 },
        { id: 'p-2', title: 'كرياتين ميكرونايزد نقي 500 جرام', barcode: '6221001002', price: 1750, stock_quantity: 18 },
        { id: 'p-3', title: 'طاقة وتمرين C4 بنكهة الفواكه', barcode: '6221001003', price: 2250, stock_quantity: 22 },
        { id: 'p-4', title: 'أحزمة رفع أثقال تيتان الأصلية', barcode: '6221001004', price: 900, stock_quantity: 50 },
      ]);
    }
  }, []);

  // Process Hardware Scanner or Manual Input
  const handleProcessBarcodeOrQR = async (code: string) => {
    const raw = code.trim();
    if (!raw) return;

    if (isDesktopEnv && (window as any).pulsopsPOS) {
      const api = (window as any).pulsopsPOS;

      // Check if it's a product barcode
      const product = await api.searchProduct(raw);
      if (product) {
        addToCart(product);
        setScannerInput('');
        return;
      }

      // Check if it's a Member QR / ID
      const checkInRes = await api.checkInMember(raw);
      if (checkInRes.success) {
        setScannedMember(checkInRes.member);
        setCheckInStatus({
          success: true,
          message: checkInRes.message,
          isOffline: checkInRes.isOffline,
        });
      } else {
        setCheckInStatus({
          success: false,
          message: checkInRes.message || 'لم يتم العثور على المتدرب في قاعدة البيانات المحلية',
        });
      }
    } else {
      // Web fallback
      const matchProd = localProducts.find((p) => p.barcode === raw || p.id === raw);
      if (matchProd) {
        addToCart(matchProd);
      } else {
        setScannedMember({
          id: 'usr-member',
          name: 'طارق المنصور',
          phone: '+20 100 123 4567',
          membership_status: 'نشط',
          qr_secret: 'usr-member',
          valid_until: '2027-12-31',
          plan: 'الباقة الذهبية السنوية VIP',
        });
        setCheckInStatus({
          success: true,
          message: 'تم تسجيل الدخول بنجاح للمتدرب: طارق المنصور (نشط)',
          isOffline: !isOnline,
        });
      }
    }
    setScannerInput('');
  };

  const addToCart = (product: LocalProduct) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: { ...current, quantity: newQty },
      };
    });
  };

  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Complete Retail Sale (Offline-First)
  const handleCompleteSale = async () => {
    if (cartTotal <= 0) return;

    const items = Object.values(cart).map((it) => ({
      id: it.product.id,
      title: it.product.title,
      price: it.product.price,
      quantity: it.quantity,
    }));

    const salePayload = {
      items,
      totalAmount: cartTotal,
      paymentMethod,
      memberName: scannedMember ? scannedMember.name : 'عميل نقدي / متدرب',
      timestamp: new Date().toISOString(),
    };

    if (isDesktopEnv && (window as any).pulsopsPOS) {
      const api = (window as any).pulsopsPOS;
      const res = await api.checkoutSale(salePayload);
      if (res.success) {
        setLastReceipt(res.printResult);
        setCart({});
        if (paymentMethod === 'CASH') {
          setDrawerAlert('تم فتح درج النقدية تلقائياً وطباعة إيصال 80mm حراري فوراً 💵');
          setTimeout(() => setDrawerAlert(null), 4000);
        }
        // Refresh local product list
        const refreshed = await api.getAllLocalProducts();
        if (refreshed) setLocalProducts(refreshed);
      }
    } else {
      // Browser fallback simulation
      setLastReceipt({
        success: true,
        bytesSent: 420,
        cashDrawerTriggered: paymentMethod === 'CASH',
        printerModel: 'ESC/POS 80mm Direct USB Thermal Printer',
        status: 'PRINTED_AND_CUT',
      });
      setPendingSyncCount((prev) => prev + 1);
      setCart({});
      if (paymentMethod === 'CASH') {
        setDrawerAlert('تم فتح درج النقدية وطباعة الإيصال الحراري 80mm بنجاح 💵');
        setTimeout(() => setDrawerAlert(null), 4000);
      }
    }
  };

  // Toggle Network State Simulation (Offline / Online testing)
  const handleToggleNetwork = async () => {
    const nextState = !isOnline;
    if (isDesktopEnv && (window as any).pulsopsPOS) {
      const api = (window as any).pulsopsPOS;
      await api.toggleNetworkSimulation(nextState);
    }
    setIsOnline(nextState);
  };

  // Trigger Manual Cloud Sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    if (isDesktopEnv && (window as any).pulsopsPOS) {
      const api = (window as any).pulsopsPOS;
      const res = await api.triggerManualSync();
      if (res.success) {
        setSyncAlert(`تم مزامنة كافة العمليات المعلقة بنجاح مع السحاب NestJS!`);
        setTimeout(() => setSyncAlert(null), 3500);
      }
    } else {
      setTimeout(() => {
        setPendingSyncCount(0);
        setSyncAlert('تمت مزامنة المعاملات المعلقة بنجاح!');
        setTimeout(() => setSyncAlert(null), 3500);
      }, 1200);
    }
    setIsSyncing(false);
  };

  // Trigger Cash Drawer
  const handleOpenDrawerOnly = async () => {
    if (isDesktopEnv && (window as any).pulsopsPOS) {
      await (window as any).pulsopsPOS.openCashDrawer();
    }
    setDrawerAlert('تم إرسال إشارة فتح درج النقدية عبر منفذ الطابعة الحرارية ESC/POS ⚡');
    setTimeout(() => setDrawerAlert(null), 3500);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141414] border border-[#282828] space-y-6 shadow-2xl animate-fadeIn">
      {/* ── Top Bar: Kiosk Header & Offline-First Badge ──────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#282828]">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-[#00FF66]/15 border border-[#00FF66]/40 flex items-center justify-center text-[#00FF66]">
              <Monitor size={22} />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h2 className="text-xl font-black text-white tracking-wide">
                  PulsOps Desktop POS — كاشير الاستقبال المكتبي
                </h2>
                <span className="text-[11px] font-mono bg-[#00FF66]/20 text-[#00FF66] px-2.5 py-0.5 rounded-full border border-[#00FF66]/30 font-bold">
                  {isDesktopEnv ? 'Electron Desktop Native' : 'Offline Engine Active'}
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                نظام مكتبي مستقل يعمل بدون إنترنت (SQLite محلي)، طباعة حرارية فورية 80mm ESC/POS، ومزامنة تلقائية للسحاب.
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Offline / Online Badge */}
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold transition-all ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            }`}
          >
            {isOnline ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span>
              {isOnline
                ? 'متصل بالسحاب (Online)'
                : `وضع عدم الاتصال (Offline Mode: ${pendingSyncCount} معاملة معلقة)`}
            </span>
          </div>

          {/* Network Toggle Button for Testing */}
          <button
            onClick={handleToggleNetwork}
            className="px-3 py-1.5 rounded-xl bg-[#1E1E1E] border border-[#333333] hover:border-[#00FF66]/50 text-white text-xs font-semibold flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer"
            title="تبديل حالة الشبكة لمحاكاة انقطاع الإنترنت"
          >
            <Zap size={14} className={isOnline ? 'text-amber-400' : 'text-[#00FF66]'} />
            <span>{isOnline ? 'محاكاة قطع الإنترنت' : 'إعادة الاتصال بالإنترنت'}</span>
          </button>

          {/* Sync Queue Button */}
          <button
            onClick={handleManualSync}
            disabled={!isOnline || isSyncing}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer ${
              pendingSyncCount > 0 && isOnline
                ? 'bg-[#00FF66] text-[#0A0A0A] border-[#00FF66] hover:bg-[#00FF66]/90'
                : 'bg-[#1E1E1E] text-[#A0A0A0] border-[#333333] hover:text-white'
            }`}
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>مزامنة السحاب ({pendingSyncCount})</span>
          </button>

          {/* Open Cash Drawer */}
          <button
            onClick={handleOpenDrawerOnly}
            className="px-3 py-1.5 rounded-xl bg-[#1E1E1E] border border-[#333333] hover:border-[#00FF66]/40 text-white text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer"
          >
            <DollarSign size={14} className="text-[#00FF66]" />
            <span>فتح الدرج</span>
          </button>

          {/* Kiosk Fullscreen */}
          {isDesktopEnv && (
            <button
              onClick={() => (window as any).pulsopsPOS?.toggleFullscreen()}
              className="p-2 rounded-xl bg-[#1E1E1E] border border-[#333333] hover:border-[#00FF66] text-[#A0A0A0] hover:text-white transition-all cursor-pointer"
              title="وضع الشاشة الكاملة (Kiosk Mode)"
            >
              <Maximize2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {drawerAlert && (
        <div className="p-3.5 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-[#00FF66] text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>{drawerAlert}</span>
        </div>
      )}

      {syncAlert && (
        <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-500 text-blue-400 text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
          <RefreshCw size={16} />
          <span>{syncAlert}</span>
        </div>
      )}

      {/* ── Main POS Workspace Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Hardware Scanner & Products Grid */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Hardware Barcode / QR Scanner Input */}
          <div className="p-4 rounded-xl bg-[#101010] border border-[#282828] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Scan size={16} className="text-[#00FF66]" />
                <span>قارئ الباركود والـ QR السريع (Hardware Wedge Scanner)</span>
              </span>
              <span className="text-[10px] text-[#A0A0A0] font-mono">
                يدعم الماسح الضوئي الليزري والكاميرا
              </span>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="relative flex-1">
                <Barcode size={18} className="absolute right-3 top-2.5 text-[#666666]" />
                <input
                  type="text"
                  placeholder="امسح باركود المنتج (مثل: 6221001001) أو كود المشترك (usr-member)..."
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleProcessBarcodeOrQR(scannerInput);
                  }}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl pr-10 pl-3 py-2 text-xs text-white focus:border-[#00FF66] focus:outline-none font-mono"
                />
              </div>
              <button
                onClick={() => handleProcessBarcodeOrQR(scannerInput)}
                className="neon-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
              >
                <Search size={14} />
                <span>تحقق</span>
              </button>
            </div>

            {/* Scanned Member Feedback Badge */}
            {checkInStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  checkInStatus.success
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-500/40 text-red-300'
                }`}
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {checkInStatus.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span className="font-bold">{checkInStatus.message}</span>
                </div>
                {checkInStatus.isOffline && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                    حفظ في SQLite المحلي (قيد المزامنة)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. Fast Product Catalog Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#A0A0A0] uppercase font-mono tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse">
                <Package size={14} className="text-[#00FF66]" />
                <span>المنتجات المخزنة محلياً في SQLite (Local Catalog)</span>
              </h3>
              <span className="text-[11px] text-[#666666] font-mono">{localProducts.length} أصناف</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className="p-3.5 rounded-xl bg-[#101010] border border-[#282828] hover:border-[#00FF66]/50 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#A0A0A0] bg-[#181818] px-2 py-0.5 rounded border border-[#282828]">
                        {prod.barcode}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          prod.stock_quantity > 5 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                        }`}
                      >
                        المخزون: {prod.stock_quantity}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2 group-hover:text-[#00FF66] transition-colors line-clamp-1">
                      {prod.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1C1C1C] flex items-center justify-between">
                    <span className="text-sm font-black text-white font-mono">
                      {prod.price.toLocaleString()} ج.م
                    </span>
                    <button className="text-[10px] bg-[#1E1E1E] group-hover:bg-[#00FF66] group-hover:text-[#0A0A0A] text-white px-2.5 py-1 rounded-lg font-bold transition-all">
                      + إضافة للفاتورة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): POS Cart, Checkout & ESC/POS Receipt */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#101010] border border-[#282828] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <ShoppingCart size={18} className="text-[#00FF66]" />
                <h3 className="text-sm font-bold text-white">فاتورة البيع الحالية (Cart)</h3>
              </div>
              {scannedMember && (
                <div className="text-[11px] bg-[#00FF66]/10 text-[#00FF66] px-2 py-0.5 rounded border border-[#00FF66]/30 flex items-center space-x-1 rtl:space-x-reverse">
                  <UserCheck size={12} />
                  <span>{scannedMember.name}</span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
              {Object.keys(cart).length === 0 ? (
                <div className="py-10 text-center text-[#666666] text-xs">
                  السلة فارغة. قم بمسح الباركود أو الضغط على أي منتج للإضافة.
                </div>
              ) : (
                Object.values(cart).map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-2.5 rounded-xl bg-[#161616] border border-[#242424] flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <h5 className="font-bold text-white line-clamp-1">{product.title}</h5>
                      <span className="text-[10px] text-[#A0A0A0] font-mono">
                        {product.price.toLocaleString()} ج.م × {quantity}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse bg-[#202020] rounded-lg border border-[#333333]">
                        <button
                          onClick={() => updateCartQuantity(product.id, -1)}
                          className="w-6 h-6 text-white hover:text-red-400 font-bold flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-white text-xs">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, 1)}
                          className="w-6 h-6 text-white hover:text-[#00FF66] font-bold flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono font-bold text-[#00FF66] min-w-[65px] text-left">
                        {(product.price * quantity).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Method Selector & Totals */}
          <div className="pt-3 border-t border-[#282828] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A0A0A0]">طريقة التحصيل والدفع:</span>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 rtl:space-x-reverse ${
                    paymentMethod === 'CASH'
                      ? 'bg-[#00FF66] text-[#0A0A0A]'
                      : 'bg-[#1C1C1C] text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  <DollarSign size={13} />
                  <span>نقدي (فتح الدرج)</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 rtl:space-x-reverse ${
                    paymentMethod === 'CARD'
                      ? 'bg-[#00FF66] text-[#0A0A0A]'
                      : 'bg-[#1C1C1C] text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  <CreditCard size={13} />
                  <span>فيزا / بطاقة</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-bold">المجموع الإجمالي:</span>
              <span className="text-xl font-black text-[#00FF66] font-mono">
                {cartTotal.toLocaleString()} ج.م
              </span>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={cartTotal === 0}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all shadow-lg ${
                cartTotal > 0
                  ? 'neon-btn cursor-pointer'
                  : 'bg-[#1C1C1C] text-[#555555] cursor-not-allowed border border-[#282828]'
              }`}
            >
              <Printer size={16} />
              <span>
                {paymentMethod === 'CASH'
                  ? 'إتمام البيع + فتح درج النقدية + طباعة إيصال 80mm'
                  : 'إتمام البيع بالبطاقة + طباعة إيصال 80mm'}
              </span>
            </button>

            {/* Last ESC/POS Receipt Metadata */}
            {lastReceipt && (
              <div className="p-3 rounded-xl bg-[#141414] border border-[#282828] text-[11px] text-[#A0A0A0] space-y-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Printer size={13} className="text-[#00FF66]" />
                    <span>حالة الطابعة الحرارية 80mm:</span>
                  </span>
                  <span className="text-[#00FF66] font-mono">OK ({lastReceipt.status})</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>الأوامر المنقولة:</span>
                  <span>{lastReceipt.bytesSent} بايت ESC/POS</span>
                </div>
                <div className="flex justify-between">
                  <span>درج النقدية:</span>
                  <span>{lastReceipt.cashDrawerTriggered ? 'تم إرسال نبضة الفتح ✅' : 'لم يتم الفتح (دفع إلكتروني)'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
