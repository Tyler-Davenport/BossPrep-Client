/* eslint-disable react/prop-types */
import { getQuestions } from '@/api/questionData';
import { getTrialQuestionsByUser, updateTrialQuestion } from '@/api/trialQuestionData';
import { useAuth } from '@/utils/context/authContext';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function TrialForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [trialQuestions, setTrialQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionMap, setQuestionMap] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    console.log('Debug: user in TrialForm', user);
    console.log('Debug: using uid to fetch trial questions', user?.uid);
    if (user?.uid) {
      // fetch trialQuestions and all questions in parallel
      Promise.all([getTrialQuestionsByUser(user.uid), getQuestions()])
        .then((questions) => {
          const [trialQs, allQs] = questions;
          console.log('Debug: trialQuestions fetched', trialQs);
          setTrialQuestions(trialQs.filter((q) => q.trial == null));
          const map = {};
          allQs.forEach((q) => {
            map[q.id] = q.title || q.question;
          });
          setQuestionMap(map);
        })
        .catch((err) => {
          console.error('Error fetching trial questions:', err);
        });
    }
  }, [user]);

  const handleQuestionToggle = (trialQuestionId) => {
    setSelectedQuestions((prev) => (prev.includes(String(trialQuestionId)) ? prev.filter((id) => id !== String(trialQuestionId)) : [...prev, String(trialQuestionId)]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trial = await onSubmit({ title });
    // Update selected trial questions with the trial id
    if (trial && trial.id) {
      await Promise.all(selectedQuestions.map((qId) => updateTrialQuestion(qId, { trial: trial.id })));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="trialTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Enter trial title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="trialQuestions">
        <Form.Label>Select Trial Questions</Form.Label>
        <div>
          {trialQuestions.length === 0 && <div style={{ color: '#666' }}>No saved questions found.</div>}
          {trialQuestions.map((tq) => {
            const label = questionMap[tq.question] || `Question #${tq.question}`;
            const checked = selectedQuestions.includes(String(tq.id));
            return <Form.Check key={tq.id} type="checkbox" id={`tq-${tq.id}`} label={label} checked={checked} onChange={() => handleQuestionToggle(tq.id)} className="mb-2" />;
          })}
        </div>
      </Form.Group>
      <Button variant="success" type="submit">
        Create Trial
      </Button>
    </Form>
  );
}

export default TrialForm;
