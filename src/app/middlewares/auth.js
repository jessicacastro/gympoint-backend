import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import auth from '../../config/auth';

export default async (req, res, next) => {
  const headerAuth = req.headers.authorization;

  if (!headerAuth) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = headerAuth.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, auth.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
