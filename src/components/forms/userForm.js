'use client';

import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createUser, updateUser } from '../../api/user';
import { useAuth } from '../../utils/context/authContext';

const initialState = {
  name: '',
  displayName: '',
  email: '',
  firebaseKey: '',
  uid: '',
};

function UserForm({ obj = {} }) {
  const [formInput, setFormInput] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj?.firebaseKey) {
      setFormInput((prevState) => {
        if (prevState.firebaseKey !== obj.firebaseKey) {
          return { ...prevState, ...obj };
        }
        return prevState;
      });
    } else if (user) {
      setFormInput((prevState) => {
        if (prevState.uid !== user.uid) {
          return {
            ...prevState,
            email: user.email || '',
            uid: user.uid || '',
            firebaseKey: user.uid || '',
          };
        }
        return prevState;
      });
    }
  }, [obj, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    if (formInput?.firebaseKey && obj?.firebaseKey) {
      updateUser(formInput.firebaseKey, formInput)
        .then(() => {
          router.push('/');
        })
        .catch(() => {});
    } else {
      const payload = {
        ...formInput,
        uid: user.uid,
        firebaseKey: user.uid,
        email: user.email,
      };
      createUser(payload)
        .then(() => {
          router.push('/');
        })
        .catch(() => {});
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2>{obj?.firebaseKey ? 'Update' : 'Create'} User</h2>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Name</Form.Label>
          <Form.Control required type="text" placeholder="Name" value={formInput.name} onChange={(e) => setFormInput({ ...formInput, name: e.target.value })} />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Display Name</Form.Label>
          <Form.Control required type="text" placeholder="Display Name" value={formInput.displayName} onChange={(e) => setFormInput({ ...formInput, displayName: e.target.value })} />
        </Form.Group>
      </Row>
      <Form.Group className="mb-3" controlId="validationCustom03">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" required value={formInput.email} readOnly />
      </Form.Group>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

UserForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
    uid: PropTypes.string,
  }),
};

export default UserForm;
