const { response, request } = require("express");
//Importación del modelo
const Factura = require("../models/invoice");
const usuario = require("../models/user");

const getFacturas = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true };

  const listaFactura = await Promise.all([
    Factura.countDocuments(query),
    Factura.find(query).populate("usuario", "correo").populate("carrito"),
  ]);

  res.json({
    msg: "get Api - Controlador Usuario",
    listaFactura,
  });
};


const getFacturaXCliente = async (req = request, res = response) => {
  const _id = req.usuario.id;
  const query = { estado: true, usuario: _id };

  const listaFacturas = await Promise.all([
    Factura.countDocuments(query),
    Factura.find(query).populate("usuario", "nombre").populate("carrito")
  ,
  ]);

  res.json({
    msg: "Mis compras son estas",
    listaFacturas,
  });
};

const postFactura = async (req = request, res = response) => {
  const { usuario, ...body } = req.body;


  const fecha = Date.now();

  //Generar la data
  const data = {
    ...body,
    fecha,
    usuario: req.usuario.id,
  };

  const factura = await Factura(data);

  //Guardar en la DB
  await factura.save();

  res.status(201).json(factura);
};

module.exports = {
  getFacturas,
  postFactura,
  getFacturaXCliente
};

// CONTROLADOR
