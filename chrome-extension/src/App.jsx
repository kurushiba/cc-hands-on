import { useEffect, useState } from 'react'
import { USERS } from './data/users'
import UserList from './components/UserList'

function App() {
  const [users, setUsers] = useState(USERS)

  // Bug 3: 存在しないエンドポイントへのフェッチ
  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        return res.json()
      })
      .catch(err => console.error('[chrome-extension-demo] ユーザーの取得に失敗しました:', err))
  }, [])

  return (
    <div className="container">
      <h1>ユーザーディレクトリ</h1>
      <UserList users={users} />
    </div>
  )
}

export default App
