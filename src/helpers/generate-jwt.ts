import { sign } from 'jsonwebtoken';
import { Logger, ILogObj } from 'tslog';

const log: Logger<ILogObj> = new Logger();

const generateJWT = (uid = '') => new Promise((resolve, reject) => {
  const payload = { uid };
  const secretKey = process.env.SECRET_KEY_FOR_TOKEN;

  if (!secretKey) {
    log.error('SECRET_KEY_FOR_TOKEN is not defined');
    reject(new Error('Could not generate the token'));
    return;
  }
  sign(payload, secretKey, {
    expiresIn: '4h',
  }, (err, token) => {
    if (err) {
      log.error(err);
      reject(new Error('Could not generate the token'));
    } else {
      resolve(token);
    }
  });
});

export default generateJWT;
