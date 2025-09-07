import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getTrialQuestionsByUser = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/trial-questions?user=${firebaseKey}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

const getTrialQuestion = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/trial-questions/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

const createTrialQuestion = (trialQuestionData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/trial-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trialQuestionData),
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

const updateTrialQuestion = (id, trialQuestionData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/trial-questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trialQuestionData),
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

const deleteTrialQuestion = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/trial-questions/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.status === 204 || res.status === 200) {
          resolve();
        } else {
          res.text().then((text) => {
            try {
              resolve(JSON.parse(text));
            } catch {
              resolve();
            }
          });
        }
      })
      .catch(reject);
  });

export { createTrialQuestion, deleteTrialQuestion, getTrialQuestion, getTrialQuestionsByUser, updateTrialQuestion };
