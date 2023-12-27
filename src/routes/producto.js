const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validate-fields');
const { validarJWT } = require('../middlewares/validate-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validate-rols');

//Controllers
const { postProducto, putProducto, deleteProducto, getProductos, getProductoPorId, getVentas, getProductosMasvendidos, getProductosAgotados } = require('../controllers/producto');

const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

//Manejo de rutas

//Obtener todas las productos - publico
router.get('/', getProductos );

router.get('/mostrar/agotados',[
    validarJWT,
    esAdminRole
], getProductosAgotados );

router.get('/mostrar/mas-vendidos',[
], getProductosMasvendidos );

//Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    esAdminRole,
    validarCampos
],  getProductoPorId);

// Crear producto - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    esAdminRole,
    validarCampos
], postProducto);

// Actuaizar producto - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    esAdminRole,
    validarCampos
], putProducto);

//Borrar un producto - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('categoria').default('640a730fd2ea15582f16ac54'),
    esAdminRole,
    validarCampos,
], deleteProducto);





module.exports = router;