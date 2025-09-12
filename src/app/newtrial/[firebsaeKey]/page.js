'use client';

import { createTrial } from '@/api/trialData';
import { updateTrialQuestion } from '@/api/trialQuestionData';
import { getUser } from '@/api/user';
import TrialForm from '@/components/forms/trialForm';
import { useAuth } from '@/utils/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewTrialPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [firebaseKey, setFirebaseKey] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      getUser(user.uid).then((u) => setFirebaseKey(u?.firebaseKey || null));
    }
  }, [user]);

  const handleCreateTrial = async (trialData) => {
    if (!user?.uid || !firebaseKey) return null;
    const payload = { ...trialData, created_by: firebaseKey };
    const created = await createTrial(payload);
    if (created && created.id && trialData.selectedQuestions && trialData.selectedQuestions.length > 0) {
      await Promise.all(trialData.selectedQuestions.map((qId) => updateTrialQuestion(qId, { trial: created.id })));
    }
    router.push(`/trials/${firebaseKey}`);
    return created;
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Create a New Trial</h2>
      <TrialForm onSubmit={handleCreateTrial} />
    </div>
  );
}
