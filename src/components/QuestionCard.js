'use client';

import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getQuestions } from '../api/questionData';
import { createTrialQuestion } from '../api/trialQuestionData';
import { getUsers } from '../api/user';
import { useAuth } from '../utils/context/authContext';
import QuestionModal from './QuestionModal';

function QuestionCard() {
  const [showModal, setShowModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const { user } = useAuth();
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    getQuestions().then(setQuestionData);
  }, []);

  const handleSave = (question) => {
    const payload = {
      question: question.id,
      user: user.uid,
    };
    createTrialQuestion(payload);
    setSavedQuestions((prev) => [...prev, question.id]);
  };

  return (
    <>
      {questionData.map((question) => {
        const creator = users.find((u) => u.firebaseKey === question.created_by);
        return (
          <Card key={question.id} style={{ width: '18rem', marginBottom: '1rem' }}>
            <Card.Body>
              <Card.Title>{question.job_role}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{question.job_field}</Card.Subtitle>
              <Card.Text>
                <strong>Created By:</strong> {creator ? creator.displayName : question.created_by}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  setActiveQuestion(question);
                  setShowModal(true);
                }}
              >
                View Question
              </Button>
            </Card.Body>
          </Card>
        );
      })}
      <QuestionModal show={showModal} onHide={() => setShowModal(false)} question={activeQuestion} user={user} savedQuestions={savedQuestions} handleSave={handleSave} />
    </>
  );
}

export default QuestionCard;
