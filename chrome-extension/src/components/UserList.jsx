import UserCard from './UserCard'

function UserList({ users }) {
  return (
    <ul className="user-list">
      {/* Bug 1: key prop が欠落している */}
      {users.map(user => (
        <UserCard user={user} />
      ))}
    </ul>
  )
}

export default UserList
