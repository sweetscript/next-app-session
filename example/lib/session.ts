import nextAppSession from '../../';

export type SessionData = {
  counter?: number;
  full_name?: string;
};

export const session = nextAppSession<SessionData>({
  name: 'EXAMPLE_SID',
  secret: process.env.COOKIE_SECRET
});
