import UserCard from './UserCard';

function UserList({ users }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <UserCard user={user} />
      ))}
    </ul>
  );
}

export default UserList;
