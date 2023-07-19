'use client';

import { useState } from 'react';
import styles from '../page.module.css';

const SessionCounter = (params: { initCounter?: number }) => {
  const [isBusy, setIsBusy] = useState(false);
  const [counter, setCounter] = useState(params.initCounter ?? 0);

  const handleIncrement = () => {
    if (isBusy) return;
    setIsBusy(true);

    fetch('/api/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((res) => {
        setCounter(res?.counter);
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
      <p>
        Current increment: <span>{counter?.toString()}</span>
      </p>
      <br />
      <button
        type='button'
        disabled={isBusy}
        className={styles.button}
        onClick={handleIncrement}
      >
        + Increment
      </button>
    </div>
  );
};
export default SessionCounter;
