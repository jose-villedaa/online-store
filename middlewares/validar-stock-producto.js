const { request, response } = require("express");
const Producto = require("../models/producto");



const validarDisponibilidadProducto = async (req = request, res = response, next) => {
  const { productos, cantidad } = req.body;

  for (let i = 0; i < productos.length; i++) {
    const cantidadesProducto = cantidad[i];
    const producto = productos[i];

    const buscarProductoDB = await Producto.findById(producto);
    
    if (buscarProductoDB) {
      if (buscarProductoDB.disponible === false) {
        return res.status(400).json({
          msg: "Lo sentimos, El Producto no esta disponible :(",
        });
      }

      if (cantidadesProducto > buscarProductoDB.cantidad) {
        return res.status(405).json({
          msg: `Lo sentimos, El producto no tiene stock :(`,
        });
      }
    }
  }

  next();
};


module.exports = {
  validarDisponibilidadProducto
};
