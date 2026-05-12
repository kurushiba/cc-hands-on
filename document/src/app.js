let expenses = loadExpenses();
let currentCategory = 'all';

const amountInput = document.getElementById('amount-input');
const descInput = document.getElementById('desc-input');
const categorySelect = document.getElementById('category-select');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const filterSelect = document.getElementById('filter-select');
const totalAmount = document.getElementById('total-amount');
const expenseList = document.getElementById('expense-list');

function initForm() {
  const categories = getCategories();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);

    const filterOption = document.createElement('option');
    filterOption.value = cat;
    filterOption.textContent = cat;
    filterSelect.appendChild(filterOption);
  });

  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
}

function addExpense() {
  const amount = parseInt(amountInput.value, 10);
  const description = descInput.value.trim();
  const category = categorySelect.value;
  const date = dateInput.value;

  if (!amount || amount <= 0) return;
  if (!description) return;

  expenses.push({ id: Date.now(), amount, description, category, date });
  saveExpenses(expenses);

  amountInput.value = '';
  descInput.value = '';
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  render();
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses(expenses);
  render();
}

function getFilteredExpenses() {
  const filtered = currentCategory === 'all'
    ? [...expenses]
    : expenses.filter(e => e.category === currentCategory);

  return filtered.sort((a, b) => b.date.localeCompare(a.date));
}

function renderExpenseList(filtered) {
  if (filtered.length === 0) {
    expenseList.innerHTML = '<li class="empty-message">支出データがありません</li>';
    return;
  }

  expenseList.innerHTML = filtered.map(e => {
    const slug = e.category.replace(/\s/g, '-');
    return `
      <li class="expense-item" data-id="${e.id}">
        <span class="category-badge cat-${slug}">${e.category}</span>
        <span class="expense-desc">${escapeHtml(e.description)}</span>
        <span class="expense-date">${formatDate(e.date)}</span>
        <span class="expense-amount">${formatCurrency(e.amount)}</span>
        <button class="delete-btn" title="削除">&#x2715;</button>
      </li>
    `;
  }).join('');
}

function render() {
  const filtered = getFilteredExpenses();
  renderExpenseList(filtered);
  totalAmount.textContent = formatCurrency(calculateTotal(filtered));
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

addBtn.addEventListener('click', addExpense);

amountInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addExpense();
});

descInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addExpense();
});

filterSelect.addEventListener('change', () => {
  currentCategory = filterSelect.value;
  render();
});

expenseList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const item = e.target.closest('.expense-item');
    if (item) deleteExpense(Number(item.dataset.id));
  }
});

initForm();
render();
