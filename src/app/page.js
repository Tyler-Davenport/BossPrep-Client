'use client';

// any component that uses useAuth needs this because if a component directly imports useAuth, it needs to be a client component since useAuth uses React hooks.

import { getUser } from '@/api/user';
import AuthRedirect from '@/components/AuthRedirect';
import { signOut } from '@/utils/auth'; // anything in the src dir, you can use the @ instead of relative paths
import { useAuth } from '@/utils/context/authContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

function Home() {
  const { user } = useAuth();
  const [firebaseKey, setFirebaseKey] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      getUser(user.uid).then((userRecord) => {
        setFirebaseKey(userRecord?.firebaseKey || null);
      });
    }
  }, [user]);

  return (
    <>
      <AuthRedirect />
      <div
        className="text-center d-flex flex-column justify-content-center align-content-center"
        style={{
          height: '90vh',
          padding: '30px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <h1>Hello {user.displayName}! </h1>
        <p>Click the button below to logout!</p>
        <Button variant="danger" type="button" size="lg" className="copy-btn" onClick={signOut}>
          Sign Out
        </Button>
        <div className="d-grid gap-2 mt-4">
          <Link href="/questboard" passHref>
            <Button className="btn btn-primary" type="button">
              Quest Board
            </Button>
          </Link>
          {firebaseKey ? (
            <Link href={`/profile/${firebaseKey}`} passHref>
              <Button className="btn btn-primary" type="button">
                My Archive
              </Button>
            </Link>
          ) : (
            <Button className="btn btn-primary" type="button" disabled>
              My Archive
            </Button>
          )}
          <Link href="/newquestion" passHref>
            <Button className="btn btn-primary" type="button">
              Create Question
            </Button>
          </Link>
          <Link href="/adventurers" passHref>
            <Button className="btn btn-primary" type="button">
              All Adventurers
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
