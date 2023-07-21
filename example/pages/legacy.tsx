import '../app/globals.css';
import styles from '../app/page.module.css';
import { Inter } from 'next/font/google';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { session } from '../lib/session';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function handler(props: {
  counter?: number;
  full_name?: string;
}) {
  const { counter: initCounter, full_name: initFullName } = props;
  const [isBusy, setIsBusy] = useState(false);
  const [counter, setCounter] = useState(initCounter ?? 0);
  const [full_name, setFullName] = useState(initFullName ?? '');

  const handleIncrement = () => {
    if (isBusy) return;
    setIsBusy(true);

    fetch('/api/legacy/counter/increment', {
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFullName(e.target.value);
  };
  const handleUpdate: FormEventHandler = (e) => {
    e.preventDefault();
    if (isBusy) return;
    setIsBusy(true);

    fetch('/api/legacy/update', {
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
    <div className={inter.className}>
      <main className={styles.main}>
        <div className={styles.description}>
          <div className={styles.tabs}>
            <Link href='/'>App router demo</Link>
            <Link href='legacy' className={styles.tabSelected}>
              Page router demo
            </Link>
          </div>

          <h1>Pages router demo (legacy)</h1>
          <br />
          <small className={styles.note}>
            To test the session update the values on the following forms and
            then refresh this page to see the if the values you stored are
            pre-populated
          </small>
          <br />
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
          <br />
          <br />
          <div className={styles.card}>
            <p>Use this form to test storing a string server side</p>
            <br />
            <form onSubmit={handleUpdate} className={styles.form}>
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

          <br />

          <br />
          <small className={styles.note}>
            <strong>Note:</strong> If you're using the default MemoryStore then
            session will reset each time the Node process is rerun. MemoryStore
            should only be used for development purposes.
          </small>
        </div>
      </main>
    </div>
  );
}

// Serve session as props
export async function getServerSideProps({ req }: any) {
  // Get data from session
  const data = await session(req).all();

  // Pass data to the page via props
  return { props: { ...data } };
}
