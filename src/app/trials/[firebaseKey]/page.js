/* eslint-disable react/prop-types */

'use client';

import { getUser } from '@/api/user';
import { useAuth } from '@/utils/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { getTrialsByCreator } from '../../../api/trialData';
import TrialCard from '../../../components/TrialCard';

export default function TrialsPage({ params }) {
  const { firebaseKey } = params;
  const [profile, setProfile] = useState(null);
  const [trials, setTrials] = useState([]);
  const { user } = useAuth();
  const isOwner = user && (user.uid === firebaseKey || user.firebaseKey === firebaseKey);
  const router = useRouter();

  useEffect(() => {
    getUser(firebaseKey).then((data) => {
      setProfile(data);
    });
  }, [firebaseKey]);

  useEffect(() => {
    getTrialsByCreator(firebaseKey).then(setTrials);
  }, [firebaseKey]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span>{profile.displayName}&apos;s Created Trials</span>
        {isOwner && (
          <Button variant="success" onClick={() => router.push(`/newtrial/${firebaseKey}`)}>
            Create Trial
          </Button>
        )}
      </div>
      {trials.map((trial) => (
        <TrialCard key={trial.id} trial={trial} isOwner={isOwner} />
      ))}
    </div>
  );
}
