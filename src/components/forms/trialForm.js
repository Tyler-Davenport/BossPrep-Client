/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { getQuestions } from '@/api/questionData';
import { getTrialQuestionsByTrialId, getTrialQuestionsByUser } from '@/api/trialQuestionData';
import { useAuth } from '@/utils/context/authContext';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function TrialForm({ onSubmit, initialData = {}, attachedQuestions = [], isEdit = false, trialId }) {
  const [title, setTitle] = useState(initialData.title || '');
  useEffect(() => {
    if (initialData.title !== title) {
      setTitle(initialData.title || '');
    }
  }, [initialData.title]);
  const [trialQuestions, setTrialQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(attachedQuestions);
  useEffect(() => {
    if (isEdit && JSON.stringify(attachedQuestions) !== JSON.stringify(selectedQuestions)) {
      setSelectedQuestions(attachedQuestions);
    }
  }, [attachedQuestions, isEdit]);
  const [questions, setQuestions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (isEdit && trialId) {
      Promise.all([getTrialQuestionsByTrialId(trialId), getQuestions()])
        .then(([trialQs, allQs]) => {
          setTrialQuestions(trialQs);
          setQuestions(allQs);
        })
        .catch(() => {});
    } else if (user?.uid) {
      Promise.all([getTrialQuestionsByUser(user.uid), getQuestions()])
        .then(([trialQs, allQs]) => {
          setTrialQuestions(trialQs.filter((q) => q.trial == null));
          setQuestions(allQs);
        })
        .catch(() => {});
    }
  }, [user?.uid, isEdit, trialId]);

  const handleQuestionToggle = (trialQuestionId) => {
    setSelectedQuestions((prev) => (prev.includes(String(trialQuestionId)) ? prev.filter((id) => id !== String(trialQuestionId)) : [...prev, String(trialQuestionId)]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ title, selectedQuestions });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="trialTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Enter trial title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Form.Group>
      {isEdit ? (
        <Form.Group className="mb-3" controlId="editTrialQuestions">
          <Form.Label>Checked questions will be removed from the trial</Form.Label>
          <div>
            {trialQuestions.length === 0 && <div style={{ color: '#666' }}>No trial questions found.</div>}
            {trialQuestions
              .filter((q) => q.trial === trialId || q.trial === Number(trialId))
              .map((tq) => {
                const qObj = questions.find((question) => String(question.id) === String(tq.question));
                const label = (qObj && (qObj.question_text || qObj.text || qObj.label || qObj.title || qObj.question)) || tq.text || tq.label || tq.title || tq.question || tq.question_text || `Question #${tq.id}`;
                const checked = !selectedQuestions.includes(String(tq.id));
                return <Form.Check key={tq.id} type="checkbox" id={`remove-tq-${tq.id}`} label={<span style={{ color: '#fff' }}>{label} (Remove)</span>} checked={checked} onChange={() => handleQuestionToggle(tq.id)} className="mb-2" />;
              })}
          </div>
        </Form.Group>
      ) : (
        <Form.Group className="mb-3" controlId="trialQuestions">
          <Form.Label>Select Trial Questions</Form.Label>
          <div>
            {trialQuestions.length === 0 && <div style={{ color: '#666' }}>No saved questions found.</div>}
            {trialQuestions.map((tq) => {
              const q = questions.find((question) => String(question.id) === String(tq.question));
              const label = (q && (q.question_text || q.text || q.label || q.title || q.question)) || tq.text || tq.label || tq.title || tq.question || tq.question_text || `Question #${tq.id}`;
              const checked = selectedQuestions.includes(String(tq.id));
              return <Form.Check key={tq.id} type="checkbox" id={`tq-${tq.id}`} label={<span style={{ color: '#fff' }}>{label}</span>} checked={checked} onChange={() => handleQuestionToggle(tq.id)} className="mb-2" />;
            })}
          </div>
        </Form.Group>
      )}
      <Button variant="success" type="submit">
        {isEdit ? 'Update Trial' : 'Create Trial'}
      </Button>
    </Form>
  );
}

export default TrialForm;
