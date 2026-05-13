// タスクダッシュボード

const STORAGE_KEY = 'task-dashboard-data';

// ---- データ管理 ----

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultTasks();
  try {
    return JSON.parse(raw);
  } catch {
    return getDefaultTasks();
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getDefaultTasks() {
  return [
    { id: 1, title: 'プロジェクト計画書を作成する', completed: true },
    { id: 2, title: 'チームミーティングの準備をする', completed: false },
    { id: 3, title: 'デザインレビューを実施する', completed: false },
    { id: 4, title: '週次レポートを提出する', completed: true },
    { id: 5, title: 'テストケースを書く', completed: false },
  ];
}

// ---- ロジック ----

function filterByStatus(tasks, filter) {
  if (filter === 'done') return tasks.filter((t) => t.completed);
  if (filter === 'pending') return tasks.filter((t) => !t.completed);
  return tasks;
}

// ---- 描画 ----

function renderStats(tasks) {
  const total = tasks.length;

  const completedCount = tasks.completed.filter((t) => t).length;

  const pendingCount = total - completedCount;

  document.getElementById('total-count').textContent = total;
  document.getElementById('done-count').textContent = completedCount;

  document.getElementById('pendingCount').textContent = pendingCount;
}

function renderTaskList(tasks, filter) {
  const list = document.getElementById('task-list');

  const filtered = filterTasks(tasks, filter);

  if (filtered.length === 0) {
    list.innerHTML = '<li class="empty-message">タスクがありません</li>';
    return;
  }

  list.innerHTML = filtered
    .map(
      (task) => `
    <li class="task-item${task.completed ? ' completed' : ''}" data-id="${task.id}">
      <span class="task-title">${escapeHtml(task.title)}</span>
      <button class="complete-btn" ${task.completed ? 'disabled' : ''}>
        ${task.completed ? '完了済み' : '完了にする'}
      </button>
      <button class="delete-btn" title="削除">&#x2715;</button>
    </li>
  `,
    )
    .join('');
}

function render() {
  renderStats(tasks);
  renderTaskList(tasks, currentFilter);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- イベント ----

function handleAddTask() {
  const input = document.getElementById('task-input');
  const title = input.value.trim();
  if (!title) return;

  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  tasks.push({ id: newId, title, completed: false });
  saveTasks(tasks);
  input.value = '';
  render();
}

// ---- 初期化 ----

let tasks = loadTasks();
let currentFilter = 'all';

document.getElementById('add-btn').addEventListener('click', handleAddTask);

document.getElementById('task-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTask();
});

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document
      .querySelectorAll('.filter-btn')
      .forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

document.getElementById('task-list').addEventListener('click', (e) => {
  const item = e.target.closest('.task-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.classList.contains('complete-btn')) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, completed: true } : t));
    saveTasks(tasks);
    render();
  }

  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);
    render();
  }
});

render();
