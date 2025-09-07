/* eslint-disable react/prop-types */

'use client';

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { createQuestion } from '../../api/questionData';
import { getUser } from '../../api/user';
import { useAuth } from '../../utils/context/authContext';

function QuestionForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    job_role: '',
    job_field: '',
    question_text: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      setStatus('You must be logged in to submit a question.');
      return;
    }
    try {
      const userRecord = await getUser(user.uid);
      const firebaseKey = userRecord?.firebaseKey;
      if (!firebaseKey) {
        setStatus('Could not find firebaseKey for this user.');
        return;
      }
      const payload = { ...formData, created_by: firebaseKey };
      console.log('Submitting question payload:', payload);
      await createQuestion(payload);
      setStatus('Question submitted successfully!');
      setFormData({ job_role: '', job_field: '', question_text: '' });
    } catch (err) {
      setStatus('Error submitting question.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formRole">
        <Form.Label>Role</Form.Label>
        <Form.Control type="text" name="job_role" value={formData.job_role} onChange={handleChange} placeholder="Enter job role" required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formField">
        <Form.Label>Field</Form.Label>
        <Form.Control type="text" name="job_field" value={formData.job_field} onChange={handleChange} placeholder="Enter job field" required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formQuestionText">
        <Form.Label>Question Text</Form.Label>
        <Form.Control as="textarea" rows={3} name="question_text" value={formData.question_text} onChange={handleChange} placeholder="Enter your question" required />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
      {status && <div style={{ marginTop: '1rem', color: status.includes('Error') ? 'red' : 'green' }}>{status}</div>}
    </Form>
  );
}

export default QuestionForm;
