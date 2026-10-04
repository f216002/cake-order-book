// ===== Cake Order Book backend v2 — paste into Extensions > Apps Script =====
// Deploy: New deployment > Web app > Execute as: Me > Who has access: Anyone
// Supports both plain JSON and JSONP (callback=...) so the site works everywhere.

var SHEET_NAME = 'Orders';
var HEADERS = ['Timestamp','OrderID','CustomerName','Phone','CakeType','Size',
  'MessageOnCake','PickupDate','TotalPrice','AdvancePaid','Balance','Status','Notes'];

function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = String(p.action || '').toLowerCase();
  var cb = String(p.callback || '');
  try {
    if (action === 'list')     return out({ok:true, orders:listOrders()}, cb);
    if (action === 'add')      return out({ok:true, order:addOrder(p)}, cb);
    if (action === 'setstatus')return out({ok:true, order:setStatus(p)}, cb);
    return out({ok:false, error:'Unknown action: ' + action}, cb);
  } catch (err) {
    return out({ok:false, error:String(err)}, cb);
  }
}

function out(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); }
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); }
  return sh;
}

function rowToOrder(r) {
  return {
    timestamp:    r[0] instanceof Date ? r[0].toISOString() : String(r[0]||''),
    orderId:      String(r[1]||''),
    customerName: String(r[2]||''),
    phone:        String(r[3]||''),
    cakeType:     String(r[4]||''),
    size:         String(r[5]||''),
    messageOnCake:String(r[6]||''),
    pickupDate:   String(r[7]||''),
    totalPrice:   Number(r[8]||0),
    advancePaid:  Number(r[9]||0),
    balance:      Number(r[10]||0),
    status:       String(r[11]||'pending'),
    notes:        String(r[12]||''),
    synced:       true
  };
}

function listOrders() {
  var sh = sheet(), last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2,1,last-1,HEADERS.length).getValues()
    .filter(function(r){ return String(r[1]).trim() !== ''; })
    .map(rowToOrder);
}

function addOrder(p) {
  var sh = sheet();
  var total = Number(p.totalPrice||0), adv = Number(p.advancePaid||0);
  var row = [new Date(), p.orderId||'', p.customerName||'', p.phone||'',
    p.cakeType||'', p.size||'', p.messageOnCake||'', p.pickupDate||'',
    total, adv, total-adv, 'pending', p.notes||''];
  sh.appendRow(row);
  return rowToOrder(row);
}

function setStatus(p) {
  var sh = sheet(), last = sh.getLastRow();
  if (last < 2) throw new Error('No orders yet');
  var ids = sh.getRange(2,2,last-1,1).getValues().map(function(r){ return String(r[0]); });
  var i = ids.indexOf(String(p.orderId||''));
  if (i < 0) throw new Error('Order not found: ' + p.orderId);
  var st = String(p.status||'').toLowerCase();
  if (['pending','picked_up','cancelled'].indexOf(st) < 0) throw new Error('Bad status');
  sh.getRange(i+2, 12).setValue(st);
  return rowToOrder(sh.getRange(i+2,1,1,HEADERS.length).getValues()[0]);
}
