/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { getQuestions } from '@/api/questionData';
import { getTrialQuestionsByUser } from '@/api/trialQuestionData';
import { useAuth } from '@/utils/context/authContext';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function TrialForm({ onSubmit, initialData = {}, attachedQuestions = [], isEdit = false }) {
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
  const [questionMap, setQuestionMap] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      Promise.all([getTrialQuestionsByUser(user.uid), getQuestions()])
        .then((questions) => {
          const [trialQs, allQs] = questions;
          setTrialQuestions(isEdit ? trialQs : trialQs.filter((q) => q.trial == null));
          if (isEdit) {
            const attachedIds = new Set(attachedQuestions);
            const unattached = trialQs.filter((q) => q.trial == null && !attachedIds.has(String(q.id)));
            setTrialQuestions([...trialQs.filter((q) => attachedIds.has(String(q.id))), ...unattached]);
          }
          const map = {};
          allQs.forEach((q) => {
            map[q.id] = q.text || q.label || q.title || q.question;
          });
          setQuestionMap(map);
        })
        .catch(() => {});
    }
  }, [user, isEdit, attachedQuestions]);

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
      {!isEdit && (
        <Form.Group className="mb-3" controlId="trialQuestions">
          <Form.Label>Select Trial Questions</Form.Label>
          <div>
            {trialQuestions.length === 0 && <div style={{ color: '#666' }}>No saved questions found.</div>}
            {trialQuestions.map((tq) => {
              const label = questionMap[tq.question] || questionMap[tq.id] || `Question #${tq.question}`;
              const checked = selectedQuestions.includes(String(tq.id));
              return <Form.Check key={tq.id} type="checkbox" id={`tq-${tq.id}`} label={label} checked={checked} onChange={() => handleQuestionToggle(tq.id)} className="mb-2" />;
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
