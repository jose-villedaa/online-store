import { Request, Response, NextFunction } from 'express';
import { Logger, ILogObj } from 'tslog';
import User from '@models/user';
import { verify } from 'jsonwebtoken';

const log: Logger<ILogObj> = new Logger();

const verifyToken = (token: string, secretKey: string) => {
  try {
    return verify(token, secretKey);
  } catch (error) {
    log.error(error);
    throw new Error('Invalid token');
  }
};

const validarJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token in request' });
  }

  const secretKey = process.env.SECRET_KEY_FOR_TOKEN;

  if (!secretKey) {
    return res.status(500).json({ msg: 'Internal server error' });
  }

  try {
    const decoded = verifyToken(token, secretKey);

    if (typeof decoded !== 'object' || !('uid' in decoded)) {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    const { uid } = decoded;

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({ msg: 'Invalid token - user does not exist in DB' });
    }

    if (!user.state) {
      return res.status(401).json({ msg: 'Invalid token - user state: false' });
    }

    req.user = { id: user.id };
    return next();
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};

module.exports = {
  validarJWT,
};
