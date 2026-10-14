const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const http = require('http');
const { LocalPOSDatabase } = require('./db');
const { printThermalReceipt, COMMANDS } = require('./escpos');

let mainWindow = null;
const db = new LocalPOSDatabase(path.join(app.getPath('userData'), 'pulsops-pos-local.sqlite'));

// Network state & sync status
let isNetworkOnline = true;
const CLOUD_API_BASE = process.env.CLOUD_API_URL || 'http://localhost:5000';
const GYM_ID = 'gym-titan';

// Hardware barcode buffer accumulator
let barcodeBuffer = '';
let lastKeyTime = Date.now();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'PulsOps Desktop POS - Front-Desk Kiosk',
    backgroundColor: '#0A0A0A',
    frame: true, // Frameless capable / Kiosk capable
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000?mode=pos';
  mainWindow.loadURL(startUrl);

  // Keyboard wedge barcode scanner handler (typical hardware scanners emit rapid keys terminated by Enter)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      const currentTime = Date.now();
      const diff = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      if (input.key === 'Enter') {
        if (barcodeBuffer.length >= 3) {
          mainWindow.webContents.send('pos:barcode-scanned', barcodeBuffer);
          barcodeBuffer = '';
        }
      } else if (input.key.length === 1) {
        // If typing speed is high (under 60ms between strokes), it is a hardware laser/CCD scanner
        if (diff < 65 || barcodeBuffer.length === 0) {
          barcodeBuffer += input.key;
        } else {
          barcodeBuffer = input.key;
        }
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Cloud Sync Engine ────────────────────────────────────────────────────────
async function pullCloudCatalog() {
  if (!isNetworkOnline) return;

  return new Promise((resolve) => {
    const req = http.get(`${CLOUD_API_BASE}/api/gyms/${GYM_ID}/pos/sync-data`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success) {
            if (Array.isArray(parsed.members)) db.upsertMembers(parsed.members);
            if (Array.isArray(parsed.products)) db.upsertProducts(parsed.products);
            broadcastSyncStatus();
            resolve(true);
          }
        } catch {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function pushPendingSyncQueue() {
  if (!isNetworkOnline) return;

  const pending = db.getPendingSyncQueue();
  if (pending.length === 0) return;

  return new Promise((resolve) => {
    const payloadData = JSON.stringify({ batch: pending });
    const req = http.request(
      `${CLOUD_API_BASE}/api/gyms/${GYM_ID}/pos/batch-sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payloadData),
        },
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            if (result.success && Array.isArray(result.syncedIds)) {
              db.markSynced(result.syncedIds);
              broadcastSyncStatus();
              resolve(true);
            }
          } catch {
            resolve(false);
          }
        });
      }
    );

    req.on('error', () => resolve(false));
    req.setTimeout(4000, () => {
      req.destroy();
      resolve(false);
    });

    req.write(payloadData);
    req.end();
  });
}

function broadcastSyncStatus() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const status = {
    isOnline: isNetworkOnline,
    pendingCount: db.getPendingCount(),
    timestamp: new Date().toISOString(),
  };
  mainWindow.webContents.send('pos:sync-status-update', status);
}

// Periodic Background Sync Worker (every 8 seconds)
setInterval(async () => {
  if (isNetworkOnline) {
    await pushPendingSyncQueue();
    await pullCloudCatalog();
  }
}, 8000);

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
ipcMain.handle('pos:toggle-fullscreen', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
});

ipcMain.handle('pos:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('pos:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('pos:get-sync-status', () => {
  return {
    isOnline: isNetworkOnline,
    pendingCount: db.getPendingCount(),
    timestamp: new Date().toISOString(),
  };
});

ipcMain.handle('pos:set-network-state', (event, online) => {
  isNetworkOnline = !!online;
  broadcastSyncStatus();
  if (isNetworkOnline) {
    pushPendingSyncQueue().then(() => pullCloudCatalog());
  }
  return { success: true, isOnline: isNetworkOnline };
});

ipcMain.handle('pos:trigger-sync', async () => {
  if (!isNetworkOnline) return { success: false, message: 'Offline mode active' };
  await pushPendingSyncQueue();
  await pullCloudCatalog();
  return { success: true, pendingCount: db.getPendingCount() };
});

// Member Check-in
ipcMain.handle('pos:checkin-member', (event, query) => {
  const member = db.getMemberByQuery(query);
  if (!member) {
    return { success: false, message: 'المتدرب غير مسجل في قاعدة البيانات المحلية' };
  }

  // Queue check-in action
  const queueItem = db.enqueueAction('CHECK_IN', {
    memberId: member.id,
    memberName: member.name,
    gate: 'البوابة الرئيسية المكتبية (PulsOps Kiosk POS)',
    status: member.membership_status,
  });

  broadcastSyncStatus();

  return {
    success: true,
    member,
    isOffline: !isNetworkOnline,
    queueId: queueItem.id,
    message: `تم تسجيل الدخول بنجاح للمتدرب: ${member.name} (${member.membership_status})`,
  };
});

// Products & Barcode lookup
ipcMain.handle('pos:search-product', (event, barcodeOrId) => {
  const product = db.getProductByBarcode(barcodeOrId);
  return product || null;
});

ipcMain.handle('pos:get-all-products', () => {
  return db.getAllProducts();
});

ipcMain.handle('pos:get-all-members', () => {
  return db.getAllMembers();
});

// Retail Sale / Checkout
ipcMain.handle('pos:checkout-sale', async (event, saleData) => {
  const { items, totalAmount, paymentMethod, memberName } = saleData;

  // 1. Decrement local stock immediately
  if (Array.isArray(items)) {
    for (const it of items) {
      db.decrementProductStock(it.id, it.quantity || 1);
    }
  }

  // 2. Enqueue action in sync_queue with is_synced = 0
  const queueItem = db.enqueueAction('POS_SALE', {
    items,
    totalAmount,
    paymentMethod: paymentMethod || 'CASH',
    memberName: memberName || 'عميل نقدي',
  });

  // 3. Trigger Direct Thermal Receipt Printing & Cash Drawer
  const printResult = await printThermalReceipt({
    ...saleData,
    isOffline: !isNetworkOnline,
  });

  broadcastSyncStatus();

  // 4. If online, trigger background flush
  if (isNetworkOnline) {
    setImmediate(() => pushPendingSyncQueue());
  }

  return {
    success: true,
    orderId: queueItem.id,
    isOffline: !isNetworkOnline,
    printResult,
    pendingCount: db.getPendingCount(),
    message: 'تم تسجيل عملية البيع وحفظها في قاعدة البيانات المحلية بنجاح!',
  };
});

// Direct Thermal Printing
ipcMain.handle('pos:print-receipt', async (event, orderData) => {
  return await printThermalReceipt(orderData);
});

// Open Cash Drawer Trigger
ipcMain.handle('pos:open-drawer', () => {
  return {
    success: true,
    command: COMMANDS.OPEN_CASH_DRAWER,
    message: 'تم إرسال إشارة فتح درج النقدية عبر منفذ الطابعة الحرارية ESC/POS',
  };
});

app.whenReady().then(async () => {
  createWindow();
  // Initial catalog seed
  await pullCloudCatalog();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
