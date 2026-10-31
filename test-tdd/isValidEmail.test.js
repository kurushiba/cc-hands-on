const isValidEmail = require('./isValidEmail');

describe('isValidEmail', () => {
  test('有効なメールアドレスはtrueを返す', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  test('無効なメールアドレスはfalseを返す', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
