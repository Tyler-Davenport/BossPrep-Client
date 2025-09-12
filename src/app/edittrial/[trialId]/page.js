/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */

'use client';

import TrialForm from '@/components/forms/trialForm';
import { useEffect, useState } from 'react';

export default function EditTrialPage({ params }) {
  const [title, setTitle] = useState('');

  // Fetch trial title on mount
  useEffect(() => {
    async function fetchTrial() {
      try {
        const { getTrial } = await import('@/api/trialData');
        const trial = await getTrial(params.trialId);
        setTitle(trial.title || '');
      } catch (err) {
        setTitle('');
      }
    }
    fetchTrial();
  }, [params.trialId]);

  const handleSubmit = async (formData) => {
    try {
      const { updateTrial, getTrial } = await import('@/api/trialData');
      const trial = await getTrial(params.trialId);
      await updateTrial(params.trialId, { title: formData.title, created_by: trial.created_by });
      // Redirect to trials page for the owner
      window.location.href = `/trials/${trial.created_by}`;
    } catch (err) {
      alert(`Error updating trial: ${err?.message || err}`);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Edit Trial</h2>
      <TrialForm onSubmit={handleSubmit} initialData={{ title }} attachedQuestions={[]} isEdit />
    </div>
  );
}
