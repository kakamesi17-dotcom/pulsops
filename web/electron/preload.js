const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pulsopsPOS', {
  // Desktop window & status
  isDesktop: true,
  toggleFullscreen: () => ipcRenderer.invoke('pos:toggle-fullscreen'),
  minimize: () => ipcRenderer.invoke('pos:minimize'),
  close: () => ipcRenderer.invoke('pos:close'),

  // SQLite Cached Data & Offline Check-in
  checkInMember: (query) => ipcRenderer.invoke('pos:checkin-member', query),
  searchProduct: (barcodeOrId) => ipcRenderer.invoke('pos:search-product', barcodeOrId),
  getAllLocalProducts: () => ipcRenderer.invoke('pos:get-all-products'),
  getAllLocalMembers: () => ipcRenderer.invoke('pos:get-all-members'),

  // POS Sale & Checkout
  checkoutSale: (saleData) => ipcRenderer.invoke('pos:checkout-sale', saleData),

  // Thermal Printing & Cash Drawer
  printReceipt: (orderData) => ipcRenderer.invoke('pos:print-receipt', orderData),
  openCashDrawer: () => ipcRenderer.invoke('pos:open-drawer'),

  // Sync Engine & Status
  getSyncStatus: () => ipcRenderer.invoke('pos:get-sync-status'),
  triggerManualSync: () => ipcRenderer.invoke('pos:trigger-sync'),
  toggleNetworkSimulation: (isOnline) => ipcRenderer.invoke('pos:set-network-state', isOnline),

  // Hardware Scanner & Real-time Listeners
  onBarcodeScanned: (callback) => {
    const subscription = (event, barcode) => callback(barcode);
    ipcRenderer.on('pos:barcode-scanned', subscription);
    return () => ipcRenderer.removeListener('pos:barcode-scanned', subscription);
  },

  onSyncStatusChanged: (callback) => {
    const subscription = (event, status) => callback(status);
    ipcRenderer.on('pos:sync-status-update', subscription);
    return () => ipcRenderer.removeListener('pos:sync-status-update', subscription);
  },
});
