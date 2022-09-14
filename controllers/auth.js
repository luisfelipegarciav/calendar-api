const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const {
        email,
        password
    } = req.body;

    try {

        let usuario = await Usuario.findOne({
            email
        });

        if (!!usuario) {
            return res.status(400).json({
                ok: false,
                msg: `Ya existe un correo con el valor de ${email}`
            })
        }

        usuario = new Usuario(req.body);

        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
}

const loginUsuario = async (req, res = response) => {

    const {
        email,
        password
    } = req.body;

    try {

        const usuario = await Usuario.findOne({
            email
        });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: `No existe un usuario con email: ${email}`
            })
        }

        // confirmar passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: `Password invalido`
            })
        }

        // generar nuestro JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const revalidarToken = async (req, res = respons) => {

    const { uid, name } = req;
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}