/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */

'use client';

import Link from 'next/link';
import Card from 'react-bootstrap/Card';

function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Body>
        <Card.Title>{user.displayName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{user.name}</Card.Subtitle>
        <Card.Text>{user.email}</Card.Text>
        <Link href={`/profile/${user.firebaseKey}`} passHref legacyBehavior>
          <button style={{ marginTop: '1rem' }}>View Profile</button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ProfileCard;
