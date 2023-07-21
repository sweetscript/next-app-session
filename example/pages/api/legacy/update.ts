import { NextApiRequest, NextApiResponse } from 'next';
import { session } from '../../../lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await session(req).set('full_name', req.body?.full_name);
  res.status(200).json('Updated');
}
