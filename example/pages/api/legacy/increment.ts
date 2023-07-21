import { NextApiRequest, NextApiResponse } from 'next';
import { session } from '../../../lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const current = (await session(req).get('counter')) ?? 0;
  await session(req).set('counter', Number(current) + 1);
  res.status(200).json({
    counter: Number(await session(req).get('counter'))
  });
}
