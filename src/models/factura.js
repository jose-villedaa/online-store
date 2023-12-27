const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la factura es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true
    },
    fecha:{
        type: Date,
        required:[true , 'La fecha es obligatoria'],
    },
    carrito:{
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

});

module.exports = model('Factura', FacturaSchema);