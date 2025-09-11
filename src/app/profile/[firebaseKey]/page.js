/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { getTrialQuestionsByUser } from '../../../api/trialQuestionData';
import { getUser, getUsers } from '../../../api/user';
import TrialQuestionCard from '../../../components/TrialQuestionCard';
import { useAuth } from '../../../utils/context/authContext';

export default function ProfilePage({ params }) {
  const { firebaseKey } = params;
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    getUsers().then((users) => {
      const foundUser = users.find((u) => u.firebaseKey === firebaseKey);
      if (foundUser) {
        setUid(foundUser.uid);
        getUser(foundUser.uid).then((data) => {
          setProfile(data);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
  }, [firebaseKey]);

  useEffect(() => {
    getTrialQuestionsByUser(firebaseKey).then((data) => {
      setSavedQuestions(data);
    });
  }, [firebaseKey]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found.</div>;

  const isOwner = user && user.uid === uid;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f8f9fa', borderRadius: 8, color: '#000' }}>
      <h2>{profile.displayName || 'Profile'}</h2>
      <p>
        <strong>Legal Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      {isOwner && (
        <div style={{ marginTop: '2rem' }}>
          <Button variant="primary" style={{ marginRight: '1rem' }}>
            Edit Profile
          </Button>
        </div>
      )}

      <div style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <Link href={`/profile/${profile.firebaseKey}/questions`} passHref legacyBehavior>
          <Button variant="info" as="a">
            {profile.displayName}&apos;s Created Questions
          </Button>
        </Link>
        <Link href={`/trials/${profile.firebaseKey}`} passHref legacyBehavior>
          <Button variant="secondary" as="a">
            {profile.displayName}&apos;s Created Trials
          </Button>
        </Link>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Saved Questions</h4>
        {(() => {
          const questionsArr = Array.isArray(savedQuestions) ? savedQuestions : Array.isArray(savedQuestions['trial-questions']) ? savedQuestions['trial-questions'] : [];
          const handleRemove = (id) => {
            const updated = questionsArr.filter((q) => q.id !== id);
            setSavedQuestions(Array.isArray(savedQuestions) ? updated : { ...savedQuestions, 'trial-questions': updated });
          };
          return questionsArr.length === 0 ? <p>No saved questions found.</p> : questionsArr.map((question) => <TrialQuestionCard key={question.firebaseKey || question.id} question={question} onRemove={isOwner ? handleRemove : undefined} isOwner={isOwner} />);
        })()}
      </div>
    </div>
  );
}
