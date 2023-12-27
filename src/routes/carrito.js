const { Router } = require('express');
const { check } = require('express-validator');
const { getCarrito, postCarrito, putCarrito} = require('../controllers/carrito');
const { existeProductoPorId } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validate-fields');
const { validarJWT } = require('../middlewares/validate-jwt');
const { tieneRole } = require('../middlewares/validate-rols');
const { validarDisponibilidadProducto } = require('../middlewares/validar-stock-producto');

const router = Router();

router.get('/mostrar', getCarrito)

router.post('/agregar',[
    validarJWT,
    tieneRole('USER_ROLE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarDisponibilidadProducto,
    validarCampos
], postCarrito)

router.put ('/editar/:id',[
    validarJWT,
    tieneRole('USER_ROLE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarDisponibilidadProducto,
    validarCampos
], putCarrito)


module.exports = router;