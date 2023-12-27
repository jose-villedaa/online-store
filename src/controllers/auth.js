const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const Factura = require('../models/factura');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verficiar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (El correo no existe jaja)'
            });
        }

        //Si el usuario esta activo (estado = false)
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        
        //Verificar la password
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );
        const misCompras = await Factura.find({usuario: usuario.id})

        res.json({
           msg: 'LOGIN EXITOSO!',
            correo, password,
            token,
            misCompras,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }



}


module.exports = {
    login
}