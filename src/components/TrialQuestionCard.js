/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getQuestion } from '../api/questionData';
import { deleteTrialQuestion } from '../api/trialQuestionData';
import { getUsers } from '../api/user';

function TrialQuestionCard({ question, onRemove, isOwner }) {
  const [fullQuestion, setFullQuestion] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (question && question.question) {
      getQuestion(question.question).then(setFullQuestion);
    }
  }, [question]);
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  if (!question) return null;
  if (!fullQuestion)
    return (
      <Card style={{ width: '18rem', marginBottom: '1rem' }}>
        <Card.Body>Loading...</Card.Body>
      </Card>
    );

  const creator = users.find((u) => u.firebaseKey === fullQuestion.created_by);

  const handleRemove = () => {
    deleteTrialQuestion(question.id).then(() => {
      if (onRemove) onRemove(question.id);
    });
  };

  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Body>
        <Card.Title>{fullQuestion.job_role}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{fullQuestion.job_field}</Card.Subtitle>
        <Card.Text>
          <strong>Created By:</strong> {creator ? creator.displayName : fullQuestion.created_by}
        </Card.Text>
        <Card.Text>{fullQuestion.question_text}</Card.Text>
        {isOwner && (
          <Button variant="outline-danger" size="sm" style={{ marginTop: '0.5rem' }} onClick={handleRemove}>
            Remove from saved questions
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default TrialQuestionCard;
