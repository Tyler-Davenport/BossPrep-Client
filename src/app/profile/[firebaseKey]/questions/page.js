/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

'use client';

import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { getQuestions } from '../../../../api/questionData';
import { getUsers } from '../../../../api/user';
import CreatedQuestion from '../../../../components/CreatedQuestionCard';

export default function ProfileQuestionsPage({ params }) {
  const { firebaseKey } = params;
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getUsers().then((users) => {
      const foundUser = users.find((u) => u.firebaseKey === firebaseKey);
      setUser(foundUser);
    });
  }, [firebaseKey]);

  useEffect(() => {
    if (user) {
      getQuestions().then((allQuestions) => {
        const userQuestions = allQuestions.filter((q) => q.created_by === user.firebaseKey);
        setQuestions(userQuestions);
      });
    }
  }, [user]);

  if (!user) return <div>Loading user...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <a href="/newquestion">
          <Button variant="success" size="lg">
            Create Question
          </Button>
        </a>
      </div>
      <h2>{user.displayName}&apos;s Created Questions</h2>
      {questions.length === 0 ? <p>No questions created by this user.</p> : questions.map((question) => <CreatedQuestion key={question.id} question={question} onDelete={(id) => setQuestions((prev) => prev.filter((q) => q.id !== id))} />)}
    </div>
  );
}
