'use client';

// any component that uses useAuth needs this because if a component directly imports useAuth, it needs to be a client component since useAuth uses React hooks.

import { signOut } from '@/utils/auth'; // anything in the src dir, you can use the @ instead of relative paths
import { useAuth } from '@/utils/context/authContext';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import AuthRedirect from '@/components/AuthRedirect';

function Home() {
  const { user } = useAuth();

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
          <Link href="/newpage2" passHref>
            <Button className="btn btn-primary" type="button">
              My Archive
            </Button>
          </Link>
          <Link href="/newpage3" passHref>
            <Button className="btn btn-primary" type="button">
              Create Question
            </Button>
          </Link>
          <Link href="/newpage4" passHref>
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
