import { useEffect, useState } from 'react';
import { USERS } from './data/users';
import UserList from './components/UserList';

function App() {
  const [users] = useState(USERS);

  useEffect(() => {
    console.log('[App] 最終登録ユーザーを確認します...');
    const lastUser = users[users.length];
    console.log('[App] 最終登録ユーザー:', lastUser.name);
  }, []);

  return (
    <div className="container">
      <h1>ユーザーディレクトリ</h1>
      <UserList users={users} />
    </div>
  );
}

export default App;
