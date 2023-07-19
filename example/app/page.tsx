import styles from './page.module.css';
import SessionStringPreview from './children/SessionStringPreview';
import { session, SessionData } from '../lib/session';
import SessionCounter from './children/SessionCounter';

export default async function Home() {
  const data = (await session().all()) as SessionData;

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <small className={styles.note}>
          To test the session update the values on the following forms and then
          refresh this page to see the if the values you stored are
          pre-populated
        </small>
        <br />
        <SessionCounter initCounter={data?.counter} />
        <br />
        <SessionStringPreview initFullName={data?.full_name} />
        <br />

        <br />
        <small className={styles.note}>
          <strong>Note:</strong> If you're using the default MemoryStore then
          session will reset each time the Node process is rerun. MemoryStore
          should only be used for development purposes.
        </small>
      </div>
    </main>
  );
}
