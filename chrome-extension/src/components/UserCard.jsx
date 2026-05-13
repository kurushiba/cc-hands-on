function UserCard({ user }) {
  const city = user.address.city;

  return (
    <li className="user-card">
      <p className="user-name">{user.name}</p>
      <p className="user-email">{user.email}</p>
      <p className="user-department">{user.department}</p>
      <p className="user-city">{city}</p>
    </li>
  );
}

export default UserCard;
