import { Request, Response as ExpressResponse } from 'express';
import User from '@models/user.model';
import { hashSync, genSaltSync } from 'bcryptjs';

interface RequestWithUser extends Request {
  user: { id: string };
}

const listUsers = async (req: Request, res: ExpressResponse) => {
  const query = { state: true };

  const userList = await Promise.all([
    User.countDocuments(query),
    User.find(query),
  ]);

  return res.json({
    msg: 'Get API - Get Users',
    userListJSON: userList,
  });
};

const addUser = async (req: Request, res : ExpressResponse) => {
  try {
    const {
      name, email, password, rol,
    } = req.body;

    const userSavedDB = new User({
      name, email, password, rol,
    });

    const salt = genSaltSync();
    userSavedDB.password = hashSync(password, salt);

    await userSavedDB.save();

    res.json({
      msg: 'Post API - Post User',
      userSavedDB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editUser = async (req: Request, res: ExpressResponse) => {
  try {
    const { id } = req.params;
    const {
      userId, img, state, ...rest
    } = req.body;
    if (rest.password) {
      const salt = genSaltSync();
      rest.password = hashSync(rest.password, salt);
    }

    const userEdited = await User.findByIdAndUpdate(id, rest, { new: true });

    if (!userEdited) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({
      msg: 'Put API - Put User',
      userEdited,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const editAdmin = async (req: RequestWithUser, res: ExpressResponse) => {
  try {
    const userIdFromReq = req.user.id;
    const { userId: userIdFromBody, state, ...rest } = req.body;
    if (rest.password) {
      const salt = genSaltSync();
      rest.password = hashSync(rest.password, salt);
    }

    const admin = await User.findByIdAndUpdate(userIdFromReq, rest, { new: true });

    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    return res.json({
      msg: 'Put API - Edit Admin',
      admin,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req: Request, res: ExpressResponse) => {
  const { id } = req.params;

  const userDeleted = await User.findByIdAndUpdate(id, { state: false });

  res.json({
    msg: 'Delete API - Delete User',
    userDeleted,
  });
};

export {
  listUsers,
  addUser,
  editUser,
  editAdmin,
  deleteUser,
};
