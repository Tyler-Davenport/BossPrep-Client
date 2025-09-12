/* eslint-disable react/prop-types */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getUsers } from '../api/user';

function TrialCard({ trial, isOwner }) {
  // Delete trial, trial_questions, and responses
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trial and all its data?')) return;
    try {
      // Get all trial_questions for this trial
      const trialQuestions = await (await import('../api/trialQuestionData')).getTrialQuestionsByTrialId(trial.id);
      if (!Array.isArray(trialQuestions)) {
        alert('No trial questions found or error fetching trial questions.');
        console.error('trialQuestions:', trialQuestions);
        return;
      }
      // Delete all responses for each trial_question
      const { deleteResponse, getResponsesByQuestion } = await import('../api/responseData');
      await Promise.all(
        trialQuestions.map(async (tq) => {
          const responses = await getResponsesByQuestion(tq.id);
          if (!Array.isArray(responses)) {
            console.error('responses for tq.id', tq.id, ':', responses);
            return;
          }
          await Promise.all(
            responses.map(async (resp) => {
              try {
                await deleteResponse(resp.id);
              } catch (err) {
                if (err instanceof SyntaxError) {
                  console.warn('Non-JSON response deleting response', resp.id);
                } else {
                  throw err;
                }
              }
            }),
          );
        }),
      );
      // Delete all trial_questions
      const { deleteTrialQuestion } = await import('../api/trialQuestionData');
      await Promise.all(
        trialQuestions.map(async (tq) => {
          try {
            await deleteTrialQuestion(tq.id);
          } catch (err) {
            if (err instanceof SyntaxError) {
              console.warn('Non-JSON response deleting trialQuestion', tq.id);
            } else {
              throw err;
            }
          }
        }),
      );
      // Delete the trial
      const { deleteTrial } = await import('../api/trialData');
      try {
        await deleteTrial(trial.id);
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.warn('Non-JSON response deleting trial', trial.id);
        } else {
          throw err;
        }
      }
      alert('Trial and all related data deleted.');
      window.location.reload();
    } catch (err) {
      alert(`Error deleting trial: ${err?.message || err}`);
      console.error('Delete error:', err);
    }
  };
  const router = useRouter();
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    getUsers().then((users) => {
      const creator = users.find((u) => u.firebaseKey === trial.created_by);
      setCreatorName(creator ? creator.displayName : trial.created_by);
    });
  }, [trial.created_by]);

  useEffect(() => {
    // No longer needed: fetchTrialQuestionsAndTexts and cleanup
  }, [trial.id]);

  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Body>
        <Card.Title>{trial.title}</Card.Title>
        <Card.Text>
          <strong>Created By:</strong> {creatorName}
        </Card.Text>
        {/* Questions section removed as requested */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Button variant="primary" onClick={() => router.push(`/trials/${trial.created_by}/taketrial/${trial.id}`)}>
            View
          </Button>
          {isOwner && (
            <>
              <Button variant="warning" onClick={() => router.push(`/edittrial/${trial.id}`)}>
                Update
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TrialCard;
