/* eslint-disable react/prop-types */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getUsers } from '../api/user';

function TrialCard({ trial, isOwner }) {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    getUsers().then((users) => {
      const creator = users.find((u) => u.firebaseKey === trial.created_by);
      setCreatorName(creator ? creator.displayName : trial.created_by);
    });
  }, [trial.created_by]);

  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Body>
        <Card.Title>{trial.title}</Card.Title>
        <Card.Text>
          <strong>Created By:</strong> {creatorName}
        </Card.Text>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Button variant="primary" onClick={() => router.push(`/trials/${trial.created_by}/taketrial/${trial.id}`)}>
            View
          </Button>
          {isOwner && (
            <>
              <Button variant="warning" onClick={() => router.push(`/edittrial/${trial.id}`)}>
                Update
              </Button>
              <Button variant="danger">Delete</Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TrialCard;
