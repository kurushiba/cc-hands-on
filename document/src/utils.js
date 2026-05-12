function formatCurrency(amount) {
  return '¥' + amount.toLocaleString('ja-JP');
}

function formatDate(dateString) {
  const [y, m, d] = dateString.split('-');
  return `${y}/${m}/${d}`;
}

function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

function getCategories() {
  return ['食費', '交通費', '娯楽', '日用品', '医療', 'その他'];
}
