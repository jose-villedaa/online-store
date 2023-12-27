const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getCategorias, getCategoriaPorID, postCategoria, putCategoria, deleteCategoria, deleteCategoriaPrueba } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validate-fields');
const { validarJWT } = require('../middlewares/validate-jwt');
const { esAdminRole } = require('../middlewares/validate-rols');


const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/', getCategorias );

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], getCategoriaPorID );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    esAdminRole
] ,postCategoria);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
    esAdminRole
] ,putCategoria);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
    esAdminRole
] ,deleteCategoriaPrueba);



module.exports = router;