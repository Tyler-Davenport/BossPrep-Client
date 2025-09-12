/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { getUser } from '../api/user';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
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
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          BossPrep
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/questboard">
              Quest Board
            </Link>
            <Link className="nav-link" href="/newquestion">
              Create Question
            </Link>
            <Link className="nav-link" href="/adventurers">
              All Adventurers
            </Link>
            {firebaseKey ? (
              <Link className="nav-link" href={`/profile/${firebaseKey}`}>
                My Archive
              </Link>
            ) : (
              <span className="nav-link disabled">My Archive</span>
            )}
          </Nav>
          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
