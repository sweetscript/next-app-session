import { SessionData, Store } from './types';

export class MemoryStore implements Store {
  store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  async get(sid: string): Promise<SessionData | null> {
    const sess = this.store.get(sid);
    if (sess) {
      const session = JSON.parse(sess, (key, value) => {
        if (key === 'expires') return new Date(value);
        return value;
      }) as SessionData;

      // destroy expired session
      if (
        session.cookie?.expires &&
        session.cookie.expires.getTime() <= Date.now()
      ) {
        await this.destroy(sid);
        return null;
      }
      return session;
    }
    return null;
  }

  async set(sid: string, sess: SessionData) {
    this.store.set(sid, JSON.stringify(sess));
  }

  async destroy(sid: string) {
    this.store.delete(sid);
  }

  async touch(sid: string, sess: SessionData) {
    this.store.set(sid, JSON.stringify(sess));
  }
}
