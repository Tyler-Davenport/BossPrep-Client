/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */

'use client';

import { getTrial } from '@/api/trialData';
import { getTrialQuestionsByTrialId } from '@/api/trialQuestionData';
import TrialForm from '@/components/forms/trialForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTrialPage({ params }) {
  const { trialId } = params;
  const [initialData, setInitialData] = useState({});
  const [attachedQuestions, setAttachedQuestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    Promise.all([getTrial(trialId), getTrialQuestionsByTrialId(trialId)]).then(([trial, trialQuestions]) => {
      setInitialData({ title: trial.title });
      setAttachedQuestions(trialQuestions.map((tq) => String(tq.id)));
    });
  }, [trialId]);

  const handleSubmit = async (formData) => {
    try {
      const trial = await getTrial(trialId);
      if (trial.title !== formData.title) {
        const dbUrl = process.env.NEXT_PUBLIC_DB_URL || 'http://localhost:8000';
        await fetch(`${dbUrl}/trials/${trialId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formData.title, created_by: trial.created_by }),
        });
      }
      const firebaseKey = trial.created_by;
      if (firebaseKey) {
        alert('Trial updated! Redirecting...');
        router.push(`/trials/${firebaseKey}`);
      } else {
        alert('Trial updated, but could not find trial owner.');
      }
    } catch (err) {
      alert(`Error updating trial: ${err?.message || err}`);
    }
  };

  useEffect(() => {}, [initialData, attachedQuestions]);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Edit Trial</h2>
      <TrialForm onSubmit={handleSubmit} initialData={initialData} attachedQuestions={attachedQuestions} isEdit />
    </div>
  );
}
