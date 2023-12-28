import { Request, Response } from 'express';
import { Logger, ILogObj } from 'tslog';
import Invoice from '@models/invoice.model';
import User from '@models/user.model';
import bcrypt from 'bcryptjs';
import generateJWT from '@helpers/generate-jwt';

const log: Logger<ILogObj> = new Logger();

// eslint-disable-next-line consistent-return
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: 'Email does not exist',
      });
    }

    if (!user.state) {
      return res.status(400).json({
        msg: 'User is not active',
      });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).json({
        msg: 'Incorrect password',
      });
    }

    const token = await generateJWT(user.id);
    const myPurchases = await Invoice.find({ user: user.id });

    res.json({
      msg: 'Login successful',
      email,
      token,
      myPurchases,
    });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      msg: 'An error occurred during login',
    });
  }
};

export default login;
