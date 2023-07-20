import nextAppSession from '../../';

export type SessionData = {
  counter?: number;
  full_name?: string;
};

/**
 * Default implementation
 */
export const session = nextAppSession<SessionData>({
  name: 'EXAMPLE_SID',
  secret: process.env.COOKIE_SECRET
});

/**
 * Redis implementation
 */
/*import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { promisifyStore } from '../../src/utils';

export const session = nextAppSession<SessionData>({
  name: 'EXAMPLE_SID',
  secret: process.env.COOKIE_SECRET,
  // Setup store
  store: new RedisStore({
    client: new Redis({
      host: 'localhost',
      port: 6381
    }),
    prefix: 'exampleapp:'
  })
});*/
