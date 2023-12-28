import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import User from '@models/user.model';
import { hashSync, genSaltSync } from 'bcryptjs';

const getUsuarios = async (res: ExpressResponse) => {
  const query = { estado: true };

  const listUsers = await Promise.all([
    User.countDocuments(query),
    User.find(query),
  ]);

  res.json({
    msg: 'Get Api - Get Users',
    listUsersJSON: listUsers,
  });
};

const addUser = async (req: ExpressRequest, res : ExpressResponse) => {
  try {
    const {
      name, email, password, rol,
    } = req.body;

    const usuarioGuardadoDB = new User({
      name, email, password, rol,
    });

    const salt = genSaltSync();
    usuarioGuardadoDB.password = hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
      msg: 'Post API - Post Usuario',
      usuarioGuardadoDB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editUser = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const { id } = req.params;
    const {
      userId, img, state, ...resto
    } = req.body;
    if (resto.password) {
      const salt = genSaltSync();
      resto.password = hashSync(resto.password, salt);
    }

    const usuarioEditado = await User.findByIdAndUpdate(id, resto, { new: true });

    if (!usuarioEditado) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({
      msg: 'Put API - Put User',
      usuarioEditado,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const editAdmin = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const idUser = req.user.id;
    const { userId, state, ...resto } = req.body;
    if (resto.password) {
      const salt = genSaltSync();
      resto.password = hashSync(resto.password, salt);
    }

    const admin = await User.findByIdAndUpdate(idUser, resto, { new: true });

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

const deleteUser = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;

  const usuarioEliminado = await User.findByIdAndUpdate(id, { state: false });

  res.json({
    msg: 'Delete API - Delete User',
    usuarioEliminado,
  });
};

module.exports = {
  getUsuarios,
  addUser,
  editUser,
  editAdmin,
  deleteUser,
};
