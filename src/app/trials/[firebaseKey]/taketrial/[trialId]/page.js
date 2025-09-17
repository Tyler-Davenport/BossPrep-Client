/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */

'use client';

import { getQuestions } from '@/api/questionData';
import { createResponse } from '@/api/responseData';
import { getTrialQuestionsByTrialId } from '@/api/trialQuestionData';
import { useAuth } from '@/utils/context/authContext';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

export default function TakeTrialPage({ params }) {
  const [showResponses, setShowResponses] = useState({});
  const { trialId } = params;
  const [trialQuestions, setTrialQuestions] = useState([]);
  const [questionMap, setQuestionMap] = useState({});
  const [responses, setResponses] = useState({});
  const [newResponse, setNewResponse] = useState({});
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getTrialQuestionsByTrialId(trialId).then((trialQuestionsData) => {
      setTrialQuestions(trialQuestionsData);
      import('@/api/responseData').then(({ getResponses }) => {
        getResponses().then((allResponses) => {
          const grouped = {};
          trialQuestionsData.forEach((trialQuestion) => {
            grouped[trialQuestion.id] = allResponses.filter((response) => Number(response.trial_question) === Number(trialQuestion.id));
          });
          setResponses(grouped);
        });
      });
    });
    getQuestions().then((questions) => {
      const map = {};
      questions.forEach((question) => {
        map[question.id] = question;
      });
      setQuestionMap(map);
    });
    import('@/api/user').then(({ getUsers }) => {
      getUsers().then(setUsers);
    });
  }, [trialId]);

  const handleResponseChange = (trialQuestionId, text) => {
    setNewResponse((prev) => ({ ...prev, [trialQuestionId]: text }));
  };

  const handleResponseSubmit = async (trialQuestionId, questionId) => {
    if (!user?.uid) return;
    if (!newResponse[trialQuestionId]) return;
    const payload = {
      trial: Number(trialId),
      question: questionId,
      trial_question: trialQuestionId,
      user: user.uid,
      response_text: newResponse[trialQuestionId],
    };
    try {
      const created = await createResponse(payload);
      if (!created || created.error) {
        alert('Failed to create response.');
        return;
      }
      setResponses((prev) => ({
        ...prev,
        [trialQuestionId]: prev[trialQuestionId] ? [...prev[trialQuestionId], created] : [created],
      }));
      setNewResponse((prev) => ({ ...prev, [trialQuestionId]: '' }));
    } catch (error) {
      alert('Error creating response.');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Take Trial</h2>
      {trialQuestions.length === 0 ? (
        <p>No questions for this trial.</p>
      ) : (
        trialQuestions.map((trialQuestion) => {
          const question = questionMap[trialQuestion.question];
          const responseArray = responses[trialQuestion.id] || [];
          return (
            <Card key={trialQuestion.id} style={{ marginBottom: '2rem' }}>
              <Card.Body>
                <Card.Title>{question ? question.job_role : 'Loading...'}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{question ? question.job_field : ''}</Card.Subtitle>
                <Card.Text>{question ? question.question_text : ''}</Card.Text>
                <div style={{ marginTop: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: 8 }}>
                  <Button variant="outline-secondary" size="sm" style={{ marginBottom: '1rem' }} onClick={() => setShowResponses((prev) => ({ ...prev, [trialQuestion.id]: !prev[trialQuestion.id] }))}>
                    {showResponses[trialQuestion.id] ? 'Hide Responses' : `Show Responses (${responseArray.length})`}
                  </Button>
                  {showResponses[trialQuestion.id] && (
                    <div style={{ marginBottom: '1rem' }}>
                      {responseArray.length === 0 ? (
                        <div style={{ color: '#888' }}>No responses yet.</div>
                      ) : (
                        responseArray.map((response) => {
                          const responder = users.find((u) => u.firebaseKey === response.user || u.uid === response.user);
                          const canDelete = user && (user.uid === response.user || user.firebaseKey === response.user);
                          const canMove = user && (user.uid === response.user || user.firebaseKey === response.user);
                          return (
                            <div key={response.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: 4, position: 'relative' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{responder ? responder.displayName : response.user}</div>
                              <div style={{ fontSize: '1rem' }}>{response.response_text}</div>
                              <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(response.created_at).toLocaleString()}</div>
                              {canMove && (
                                <Form.Select
                                  size="sm"
                                  style={{ marginTop: '0.5rem', maxWidth: 300 }}
                                  value={response.trial_question}
                                  onChange={async (e) => {
                                    const newTrialQuestionId = e.target.value;
                                    const { updateResponse } = await import('@/api/responseData');
                                    await updateResponse(response.id, { ...response, trial_question: newTrialQuestionId });
                                    // Remove from current list and add to new trial_question list
                                    setResponses((prev) => {
                                      const updated = { ...prev };
                                      // Remove from old
                                      updated[trialQuestion.id] = updated[trialQuestion.id].filter((r) => r.id !== response.id);
                                      // Add to new
                                      if (!updated[newTrialQuestionId]) updated[newTrialQuestionId] = [];
                                      updated[newTrialQuestionId] = [...updated[newTrialQuestionId], { ...response, trial_question: newTrialQuestionId }];
                                      return updated;
                                    });
                                  }}
                                >
                                  {trialQuestions.map((tq) => (
                                    <option key={tq.id} value={tq.id}>
                                      Move to: {questionMap[tq.question]?.question_text || `Question #${tq.id}`}
                                    </option>
                                  ))}
                                </Form.Select>
                              )}
                              {canDelete && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  style={{ position: 'absolute', top: 8, right: 8 }}
                                  onClick={async () => {
                                    const { deleteResponse } = await import('@/api/responseData');
                                    await deleteResponse(response.id);
                                    setResponses((prev) => {
                                      const updated = { ...prev };
                                      updated[trialQuestion.id] = updated[trialQuestion.id].filter((r) => r.id !== response.id);
                                      return updated;
                                    });
                                  }}
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                  <Form.Group className="mb-3" controlId={`response-${trialQuestion.id}`}>
                    <Form.Label>Leave a response</Form.Label>
                    <Form.Control as="textarea" rows={2} placeholder="Type your response..." value={newResponse[trialQuestion.id] || ''} onChange={(e) => handleResponseChange(trialQuestion.id, e.target.value)} />
                  </Form.Group>
                  <Button variant="primary" size="sm" disabled={!newResponse[trialQuestion.id]} onClick={() => handleResponseSubmit(trialQuestion.id, trialQuestion.question)}>
                    Post Response
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })
      )}
    </div>
  );
}
