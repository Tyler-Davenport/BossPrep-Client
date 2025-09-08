/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { deleteQuestion, updateQuestion } from '../api/questionData';
import { createTrialQuestion } from '../api/trialQuestionData';
import { getUsers } from '../api/user';
import { useAuth } from '../utils/context/authContext';
import QuestionModal from './QuestionModal';
import UpdateQuestionModal from './UpdateQuestionModal';

function CreatedQuestion({ question, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState(question.job_role);
  const [editField, setEditField] = useState(question.job_field);
  const [editText, setEditText] = useState(question.question_text);

  const handleEdit = async () => {
    setEditRole(question.job_role);
    setEditField(question.job_field);
    setEditText(question.question_text);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (editRole !== question.job_role || editField !== question.job_field || editText !== question.question_text) {
      await updateQuestion(question.id, {
        ...question,
        job_role: editRole,
        job_field: editField,
        question_text: editText,
      });
      setShowEditModal(false);
      window.location.reload();
    } else {
      setShowEditModal(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(question.id);
      if (typeof onDelete === 'function') onDelete(question.id);
      setDeleted(true);
    }
  };

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleSave = (q) => {
    const payload = {
      question: q.id,
      user: user.uid,
    };
    createTrialQuestion(payload);
    setSavedQuestions((prev) => [...prev, q.id]);
  };

  const creator = users.find((u) => u.firebaseKey === question.created_by);
  const isOwner = user && user.uid === question.created_by;

  if (deleted) return null;
  return (
    <>
      <Card key={question.id} style={{ width: '18rem', marginBottom: '1rem' }}>
        <Card.Body>
          <Card.Title>{question.job_role}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{question.job_field}</Card.Subtitle>
          <Card.Text>
            <strong>Created By:</strong> {creator ? creator.displayName : question.created_by}
          </Card.Text>
          <Card.Text>{question.question_text}</Card.Text>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
            }}
            style={{ marginRight: '0.5rem' }}
          >
            View Question
          </Button>
          {isOwner && (
            <>
              <Button variant="warning" style={{ marginRight: '0.5rem' }} onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
      <QuestionModal show={showModal} onHide={() => setShowModal(false)} question={question} user={user} savedQuestions={savedQuestions} handleSave={handleSave} />
      <UpdateQuestionModal show={showEditModal} onHide={() => setShowEditModal(false)} editRole={editRole} setEditRole={setEditRole} editField={editField} setEditField={setEditField} editText={editText} setEditText={setEditText} handleEditSave={handleEditSave} />
    </>
  );
}

export default CreatedQuestion;
