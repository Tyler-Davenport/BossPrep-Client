/* eslint-disable react/prop-types */

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function UpdateQuestionModal({ show, onHide, editRole, setEditRole, editField, setEditField, editText, setEditText, handleEditSave }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: 'black' }}>Edit Question</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: 'black' }}>
        <Form>
          <Form.Group className="mb-3" controlId="editRole">
            <Form.Label style={{ color: 'black' }}>Job Role</Form.Label>
            <Form.Control type="text" value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ color: 'black' }} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editField">
            <Form.Label style={{ color: 'black' }}>Job Field</Form.Label>
            <Form.Control type="text" value={editField} onChange={(e) => setEditField(e.target.value)} style={{ color: 'black' }} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editText">
            <Form.Label style={{ color: 'black' }}>Question Text</Form.Label>
            <Form.Control as="textarea" rows={3} value={editText} onChange={(e) => setEditText(e.target.value)} style={{ color: 'black' }} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEditSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
