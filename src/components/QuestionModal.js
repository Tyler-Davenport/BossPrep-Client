/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function QuestionModal({ show, onHide, question, user, savedQuestions, handleSave }) {
  if (!question) return null;
  const isCreator = user && question.created_by === user.uid;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Question Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ color: 'black', fontSize: '1.5rem', background: '#fff' }}>
          <p>
            <strong>Role:</strong> {question.job_role}
          </p>
          <p>
            <strong>Field:</strong> {question.job_field}
          </p>
          <p>
            <strong>Question:</strong> {question.question_text}
          </p>
          {user && !isCreator ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: savedQuestions.includes(question.id) ? '#FFD700' : '#888' }} onClick={() => handleSave(question)} title="Save Question">
                {savedQuestions.includes(question.id) ? '★' : '☆'}
              </button>
              <span>Save</span>
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'not-allowed', fontSize: '1.5rem', color: '#888' }} disabled title="You cannot save your own question">
                ☆
              </button>
              <span>You cannot save your own question</span>
            </span>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuestionModal;
