/**
 * ESC/POS Thermal Printing and Cash Drawer Hardware Commands
 * Standard 80mm ESC/POS commands
 */

const ESC = '\x1B';
const GS = '\x1D';

const COMMANDS = {
  // Initialize printer
  INIT: ESC + '@',
  // Text alignment
  ALIGN_LEFT: ESC + 'a\x00',
  ALIGN_CENTER: ESC + 'a\x01',
  ALIGN_RIGHT: ESC + 'a\x02',
  // Text formatting
  BOLD_ON: ESC + 'E\x01',
  BOLD_OFF: ESC + 'E\x00',
  DOUBLE_HEIGHT_ON: ESC + '!\x10',
  DOUBLE_WIDTH_ON: ESC + '!\x20',
  DOUBLE_SIZE_ON: ESC + '!\x30',
  NORMAL: ESC + '!\x00',
  // Paper cutting
  FEED_AND_CUT: GS + 'V\x41\x03',
  // Open Cash Drawer (Pin 2: ESC p 0 25 250)
  OPEN_CASH_DRAWER: ESC + 'p\x00\x19\xFA',
};

/**
 * Generate 80mm Receipt Buffer for POS Retail Sales
 */
function generateReceiptEscPos(order) {
  let commands = '';
  // 1. Initialize
  commands += COMMANDS.INIT;
  
  // 2. Open Cash drawer if cash transaction
  if (order.paymentMethod === 'CASH') {
    commands += COMMANDS.OPEN_CASH_DRAWER;
  }

  // 3. Header
  commands += COMMANDS.ALIGN_CENTER;
  commands += COMMANDS.DOUBLE_SIZE_ON + COMMANDS.BOLD_ON;
  commands += 'PULSOPS POS - TITAN GYM\n';
  commands += COMMANDS.NORMAL;
  commands += 'نادي تيتان أيرون الرياضي\n';
  commands += 'فاتورة مبيعات نقدية معتمدة\n';
  commands += '------------------------------------------------\n';

  // 4. Metadata
  commands += COMMANDS.ALIGN_LEFT;
  commands += `رقم الفاتورة: ${order.orderId || ('INV-' + Date.now().toString().slice(-6))}\n`;
  commands += `التاريخ: ${new Date().toLocaleString('ar-EG')}\n`;
  commands += `العميل: ${order.memberName || 'عميل نقدي'}\n`;
  commands += `طريقة الدفع: ${order.paymentMethod === 'CASH' ? 'نقدي (Cash)' : 'بطاقة (Card / Visa)'}\n`;
  commands += `وضع المعاملة: ${order.isOffline ? '[محلي بدون إنترنت - Offline Mode]' : '[متصل بالسحاب - Online]'}\n`;
  commands += '------------------------------------------------\n';

  // 5. Items Header
  commands += COMMANDS.BOLD_ON;
  commands += 'الصنف                       الكمية    الإجمالي\n';
  commands += COMMANDS.BOLD_OFF;
  commands += '------------------------------------------------\n';

  // 6. Items
  if (Array.isArray(order.items)) {
    for (const item of order.items) {
      const title = (item.title || item.name || 'منتج').padEnd(25, ' ').slice(0, 25);
      const qty = String(item.quantity || 1).padStart(4, ' ');
      const total = `${((item.price || 0) * (item.quantity || 1)).toLocaleString()} ج.م`.padStart(15, ' ');
      commands += `${title} ${qty} ${total}\n`;
    }
  }

  // 7. Total Summary
  commands += '================================================\n';
  commands += COMMANDS.ALIGN_RIGHT;
  commands += COMMANDS.DOUBLE_HEIGHT_ON + COMMANDS.BOLD_ON;
  commands += `الإجمالي الكلي: ${(order.totalAmount || 0).toLocaleString()} ج.م\n`;
  commands += COMMANDS.NORMAL;
  commands += 'شاملة ضريبة القيمة المضافة 14%\n';
  commands += '------------------------------------------------\n';

  // 8. Footer & Barcode/QR note
  commands += COMMANDS.ALIGN_CENTER;
  commands += 'شكراً لتعاملكم مع صالة تيتان أيرون!\n';
  commands += 'للاستفسار: +20 100 123 4567\n';
  commands += 'PulsOps Offline-First POS Engine v1.0\n\n\n';

  // 9. Cut Paper
  commands += COMMANDS.FEED_AND_CUT;

  return Buffer.from(commands, 'binary');
}

/**
 * Direct Print Simulation / USB-LAN dispatcher
 */
async function printThermalReceipt(order) {
  const receiptRaw = generateReceiptEscPos(order);
  const openedDrawer = order.paymentMethod === 'CASH';

  // In production, write to USB /dev/usb/lp0 or net socket printer
  // We log the ESC/POS transmission metrics
  return {
    success: true,
    bytesSent: receiptRaw.length,
    cashDrawerTriggered: openedDrawer,
    printerModel: 'ESC/POS 80mm High-Speed Thermal Printer',
    status: 'PRINTED_AND_CUT',
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  COMMANDS,
  generateReceiptEscPos,
  printThermalReceipt,
};
