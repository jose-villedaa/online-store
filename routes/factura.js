const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getFacturas, postFactura, getFacturaXCliente } = require('../controllers/factura');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/mostrar', [
    validarJWT,
    esAdminRole
] ,getFacturas);

router.get('/mostrarFacturas', [
    validarJWT,
    validarCampos
] ,getFacturaXCliente);


// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    validarCampos
] ,postFactura);






module.exports = router;