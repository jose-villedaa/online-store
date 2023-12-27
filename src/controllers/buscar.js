const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/user');
const Categoria = require('../models/category')
const Producto = require('../models/product')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const BuscarProductoXCategoria = async (req, res) => {
    const {termino} = req.params;
    const esMongoID = ObjectId.isValid(termino);  //TRUE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        const productos = await Producto.find({categoria: categoria.id});
        return res.json({
            //results: [ usuario ]
            productos
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    }

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    console.log(categorias)

    const productos = await Producto.find({categoria: categorias});
    res.json({
        productos
    })
}


const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( categoria ) ? [ categoria ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const categoria = await Categoria.find({
        $or: [ { nombre: regex }],
        $and: [ { estado: true } ]
    });

    res.json({
        results: categoria
    })

}

const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( producto ) ? [ producto ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const producto = await Producto.find({
        $or: [ { nombre: regex }],
        $and: [ { disponible: true } ]
    });

    res.json({
        results: producto
    })

}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }


    switch (coleccion) {
        case 'categorias':
            BuscarProductoXCategoria(termino, res);
           
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Ups, se me olvido hacer esta busqueda...'
            });
        break;
    }

}


module.exports = {
    buscar,
    BuscarProductoXCategoria
}