'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '../../api/user';
import ProfileCard from '../../components/ProfileCard';

export default function AdventurersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
      {users.map((user) => (
        <ProfileCard key={user.firebaseKey} user={user} />
      ))}
    </div>
  );
}
