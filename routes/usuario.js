//Importaciones
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
  putAdmin
} = require("../controllers/usuario");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");
const router = Router();

router.get("/mostrar", getUsuarios);

router.post(
  "/agregarAdmin",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser más de 6 digitos").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol").default("ADMIN_ROLE").custom(esRoleValido),
    validarCampos,
  ],
  postUsuario
);

router.post(
  "/agregarUser",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser más de 6 digitos").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol").default("USER_ROLE").custom(esRoleValido),
    validarCampos,
  ],
  postUsuario
);

router.put(
    "/editarAdmin/",
    [
      validarJWT,
      esAdminRole,
      validarCampos,
    ],
    putAdmin
  );

  router.put(
    "/editarUser/:id",
    [
      validarJWT,
      check("id", "No es un ID valido").isMongoId(),
      check("id").custom(existeUsuarioPorId),
      validarCampos,
    ],
    putUsuario
  );

  router.delete(
    "/eliminarAdmin/:id",
    [
      validarJWT,
      check("id", "No es un ID válido").isMongoId(),
      check("id").custom(existeUsuarioPorId),
      validarCampos,
      esAdminRole,
    ],
    deleteUsuario
  );

  router.delete(
    "/eliminarUser/:id",
    [
      validarJWT,
      check("id", "No es un ID válido").isMongoId(),
      check("id").custom(existeUsuarioPorId),
      validarCampos,
    ],
    deleteUsuario
  );

module.exports = router;

// ROUTES
