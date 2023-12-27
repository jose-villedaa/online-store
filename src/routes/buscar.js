const { Router } = require('express');
const { buscar, BuscarProductoXCategoria } = require('../controllers/buscar');

const router = Router();

//Manejo de rutas

router.get('/:coleccion/:termino' ,BuscarProductoXCategoria);

router.get('/:coleccion/:termino/mostrar' ,buscar);



module.exports = router;