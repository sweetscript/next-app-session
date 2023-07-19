'use client';

import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import styles from '../page.module.css';
import { SessionData } from '../../lib/session';

const SessionStringPreview = (params: { initFullName?: string }) => {
  const [isBusy, setIsBusy] = useState(false);
  const [full_name, setFullName] = useState(params.initFullName ?? '');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFullName(e.target.value);
  };
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (isBusy) return;
    setIsBusy(true);

    fetch('/api/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name })
    })
      .then(() => {
        console.log('Session Updated');
      })
      .catch((e) => {
        console.warn(e.response);
        alert('Oops something went wrong');
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  return (
    <div className={styles.card}>
      <p>Use this form to test storing a string server side</p>
      <br />
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder='Enter text to store'
          value={full_name}
          onChange={handleChange}
        />
        <button type='submit' disabled={isBusy} className={styles.button}>
          {isBusy ? 'Updating' : 'Update Session'}
        </button>
      </form>
    </div>
  );
};
export default SessionStringPreview;
