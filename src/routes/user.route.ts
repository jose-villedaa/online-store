import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '@middlewares/validate-fields';
import validateJWT from '@middlewares/validate-jwt';
import validateRols from '@middlewares/validate-rols';

import {
  listUsers,
  addUser,
  deleteUser,
  editAdmin,
  editUser,
} from '@controllers/user.controller';

import { isValidRol, emailExists, userExistsById } from '@helpers/db-validators';

const router = Router();

const { isAdmin } = validateRols;

function addUserMiddleware(role: undefined | string) {
  return [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be more than 8 digits').isLength({
      min: 8,
    }),
    check('email', 'Email is not valid').isEmail(),
    check('email').custom(emailExists),
    check('role').default(role).custom(isValidRol),
    validateFields,
  ];
}

router.get('/show', listUsers);

router.post('/addAdmin', addUserMiddleware('ADMIN_ROLE'), addUser);

router.post('/addUser', addUserMiddleware('USER_ROLE'), addUser);

router.put('/editAdmin/', [validateJWT, isAdmin, validateFields], editAdmin);

router.put('/editUser/:id', [validateJWT, check('id', 'Not a valid ID').isMongoId(), check('id').custom(userExistsById), validateFields], editUser);

router.delete('/deleteAdmin/:id', [validateJWT, check('id', 'Not a valid ID').isMongoId(), check('id').custom(userExistsById), validateFields, isAdmin], deleteUser);

router.delete('/deleteUser/:id', [validateJWT, check('id', 'Not a valid ID').isMongoId(), check('id').custom(userExistsById), validateFields], deleteUser);

export default router;
