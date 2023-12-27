import { Request, Response, NextFunction } from 'express';

type User = {
  id: string;
  rol: string;
  name: string;
};

type RequestWithUser = Request & {
  user?: User;
};

const ROLES = {
  ADMIN: 'ADMIN_ROLE',
  USER: 'USER_ROLE',
};

const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      msg: 'Requires verify the role without validating the token first',
    });
  }

  const { rol, name } = req.user;

  if (rol !== ROLES.ADMIN) {
    return res.status(403).json({
      msg: `${name} is not an administrator - cannot perform this action`,
    });
  }

  return next();
};

const tieneRole = (...roles: string[]) => (
  req : RequestWithUser,
  res : Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      msg: 'requires verify the role without validating the token first',
    });
  }

  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({
      msg: `The service requires one of these roles: ${roles}`,
    });
  }

  return next();
};

module.exports = {
  tieneRole,
  isAdmin,
};
