const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la cateogira es obligatorio'],
        unique: true
    },
    descripcion: { 
        type: String 
    },
    disponible: { 
        type: Boolean, 
        default: true 
    },
    precio: {
        type: Number,
        default: 0
    },
    cantidadVendida: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true, 
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

});


module.exports = model('Producto', ProductoSchema);