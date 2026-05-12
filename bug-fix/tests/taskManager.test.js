'use strict';

const {
  createTask,
  addTask,
  completeTask,
  deleteTask,
  getCompletedTasks,
  calculateProgress,
  sortByPriority,
} = require('../src/taskManager');

// ---- テスト用のサンプルデータ（各テスト前にリセット） ----
let sampleTasks;
beforeEach(() => {
  sampleTasks = [
    { id: 1, title: '仕様書を読む',           priority: 'high',   completed: true  },
    { id: 2, title: 'PRをレビューする',        priority: 'medium', completed: false },
    { id: 3, title: 'ミーティング議事録を書く', priority: 'low',    completed: false },
    { id: 4, title: 'デプロイ作業',            priority: 'high',   completed: true  },
  ];
});
// ----------------------------------------------------------

describe('createTask', () => {
  test('正しいタスクオブジェクトを返す', () => {
    const task = createTask(1, '仕様書を読む', 'high');
    expect(task).toEqual({
      id: 1,
      title: '仕様書を読む',
      priority: 'high',
      completed: false,
    });
  });

  test('タイトルが空のときエラーを投げる', () => {
    expect(() => createTask(1, '')).toThrow('タイトルは必須です');
    expect(() => createTask(1, '   ')).toThrow('タイトルは必須です');
  });
});

describe('addTask', () => {
  test('タスクを追加した新しい配列を返す', () => {
    const tasks = [{ id: 1, title: '既存タスク', priority: 'low', completed: false }];
    const result = addTask(tasks, '新しいタスク', 'high');
    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({ id: 2, title: '新しいタスク', priority: 'high' });
  });

  test('元の配列を変更しない', () => {
    const tasks = [{ id: 1, title: '既存タスク', priority: 'low', completed: false }];
    addTask(tasks, '新しいタスク');
    expect(tasks).toHaveLength(1);
  });
});

describe('completeTask', () => {
  test('指定したIDのタスクが完了状態になる', () => {
    const result = completeTask(sampleTasks, 2);
    const target = result.find((t) => t.id === 2);
    expect(target.completed).toBe(true);
  });

  test('元の配列を変更しない', () => {
    completeTask(sampleTasks, 2);
    // 元のオブジェクトが書き換えられていないことを確認
    expect(sampleTasks[1].completed).toBe(false);
  });
});

describe('deleteTask', () => {
  test('指定したIDのタスクが除かれる', () => {
    const result = deleteTask(sampleTasks, 1);
    expect(result.find((t) => t.id === 1)).toBeUndefined();
    expect(result).toHaveLength(sampleTasks.length - 1);
  });

  test('元の配列を変更しない', () => {
    deleteTask(sampleTasks, 1);
    expect(sampleTasks).toHaveLength(4);
  });
});

describe('getCompletedTasks', () => {
  test('完了したタスクだけを返す', () => {
    const result = getCompletedTasks(sampleTasks);
    // sampleTasks のうち完了済みは id:1 と id:4 の2件
    expect(result).toHaveLength(2);
    result.forEach((task) => {
      expect(task.completed).toBe(true);
    });
  });
});

describe('calculateProgress', () => {
  test('完了率をパーセント（0〜100の整数）で返す', () => {
    // sampleTasks: 4件中2件完了 → 50
    expect(calculateProgress(sampleTasks)).toBe(50);
  });

  test('タスクが0件のとき 0 を返す', () => {
    expect(calculateProgress([])).toBe(0);
  });
});

describe('sortByPriority', () => {
  test('high → medium → low の順に並べる', () => {
    const tasks = [
      { id: 1, title: 'A', priority: 'low',    completed: false },
      { id: 2, title: 'B', priority: 'high',   completed: false },
      { id: 3, title: 'C', priority: 'medium', completed: false },
    ];
    const result = sortByPriority(tasks);
    expect(result[0].priority).toBe('high');
    expect(result[1].priority).toBe('medium');
    expect(result[2].priority).toBe('low');
  });

  test('元の配列を変更しない', () => {
    const tasks = [
      { id: 1, title: 'A', priority: 'low',  completed: false },
      { id: 2, title: 'B', priority: 'high', completed: false },
    ];
    sortByPriority(tasks);
    expect(tasks[0].priority).toBe('low');
  });
});
