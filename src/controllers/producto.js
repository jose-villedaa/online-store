const { request, response, json } = require("express");
const Producto = require("../models/product");

const getProductos = async (req = request, res = response) => {
  //condiciones del get
  const query = { disponible: true };

  const listaProductos = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query).populate("categoria", "nombre"),
  ]);

  res.json({
    msg: "Lista de productos activos",
    listaProductos,
  });
};

const getProductoPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const prouductoById = await Producto.findById(id).populate("categoria","nombre");

  res.status(201).json(prouductoById);
};

const getProductosMasvendidos = async (req = request, res = response) => {

  const query = await Producto.find().sort({cantidadVendida: -1}).limit(2);

  res.status(201).json({
      mensaje: "Productos mas vendidos en nuestra tienda!",
      query
  })

}

const getProductosAgotados = async (req = request, res = response) => {
  const query = { disponible: false };

  const listaProductosAgotados = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("categoria", "nombre"),
  ]);

  res.json({
    msg: "Lista de productos sin stock (Agotados)",
    listaProductosAgotados,
  });
};

const postProducto = async (req = request, res = response) => {
  const { disponible, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  //validacion si el producto ya existe
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe en la DB`,
    });
  }

  //Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = await Producto(data);

  //Guardar en DB
  await producto.save();

  res.status(201).json(producto);
};

const putProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { disponible, usuario, ...restoData } = req.body;

  if (restoData.nombre) {
    restoData.nombre = restoData.nombre.toUpperCase();
    restoData.usuario = req.usuario._id;
  }

  const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, {
    new: true,
  });

  res.status(201).json({
    msg: "Put Controller Producto",
    productoActualizado,
  });
};

const deleteProducto = async (req = request, res = response) => {
  const { id } = req.params;

  //Eliminar por el estado:false
  const productoEliminado_ = await Producto.findByIdAndUpdate(
    id,
    { disponible: false },
    { new: true }
  );

  res.json({
    msg: "Producto deshabilitado",
  });
};

module.exports = {
  postProducto,
  putProducto,
  deleteProducto,
  getProductos,
  getProductoPorId,
  getProductosMasvendidos,
  getProductosAgotados,
};
