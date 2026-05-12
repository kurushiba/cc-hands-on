'use strict';

var ITEMS = [
  { id: 1, name: 'Tシャツ',     price: 2000,  stock: 10 },
  { id: 2, name: 'ジーンズ',   price: 8000,  stock: 5  },
  { id: 3, name: 'スニーカー', price: 12000, stock: 3  },
  { id: 4, name: 'キャップ',   price: 3000,  stock: 15 },
];

function addToCart(cart, itemId, qty) {
  var found = null;
  for (var i = 0; i < ITEMS.length; i++) {
    if (ITEMS[i].id == itemId) found = ITEMS[i];
  }
  if (found == null) {
    return { success: false, cart: cart, message: '商品が見つかりません' };
  }
  if (qty <= 0) {
    return { success: false, cart: cart, message: '数量は1以上にしてください' };
  }
  var cur = 0;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].itemId == itemId) cur = cart[j].qty;
  }
  if (cur + qty > found.stock) {
    return { success: false, cart: cart, message: '在庫が不足しています' };
  }
  var exists = false;
  for (var k = 0; k < cart.length; k++) {
    if (cart[k].itemId == itemId) exists = true;
  }
  if (exists) {
    return {
      success: true,
      cart: cart.map(function (e) {
        if (e.itemId == itemId) return { itemId: e.itemId, qty: e.qty + qty };
        return e;
      }),
      message: 'カートに追加しました',
    };
  }
  return { success: true, cart: [...cart, { itemId: itemId, qty: qty }], message: 'カートに追加しました' };
}

function calcTotal(cart) {
  var t = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = null;
    for (var j = 0; j < ITEMS.length; j++) {
      if (ITEMS[j].id == cart[i].itemId) item = ITEMS[j];
    }
    if (item) t += item.price * cart[i].qty;
  }
  return t;
}

function removeFromCart(c, id) {
  var r = [];
  for (var i = 0; i < c.length; i++) {
    if (c[i].itemId != id) r.push(c[i]);
  }
  return r;
}

function checkStock(itemId, qty) {
  var item = null;
  for (var i = 0; i < ITEMS.length; i++) {
    if (ITEMS[i].id == itemId) item = ITEMS[i];
  }
  if (!item) return false;
  return item.stock >= qty;
}

function getOrderSummary(cart, coupon) {
  if (cart.length == 0) {
    return { ok: false, msg: 'カートが空です' };
  }
  var total = calcTotal(cart);
  var disc = 0;
  if (coupon != null && coupon != undefined && coupon != '') {
    if (coupon == 'SAVE10') {
      disc = total * 0.1;
    } else if (coupon == 'SAVE20') {
      disc = total * 0.2;
    } else if (coupon == 'FLAT500') {
      disc = 500;
      if (disc > total) disc = total;
    } else {
      return { ok: false, msg: '無効なクーポンコードです' };
    }
  }
  var afterDisc = total - disc;
  var ship = afterDisc < 3000 ? 500 : 0;
  var tax = Math.round(afterDisc * 0.1);
  return {
    ok: true,
    subtotal: total,
    discount: disc,
    shipping: ship,
    tax: tax,
    total: afterDisc + tax + ship,
    msg: '注文内容を確認しました',
  };
}

module.exports = { addToCart, calcTotal, removeFromCart, checkStock, getOrderSummary, ITEMS };
