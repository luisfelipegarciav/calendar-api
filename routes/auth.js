/*
    Rtas de Usuarios /auth
    host + /api/auth
*/
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    crearUsuario,
    loginUsuario,
    revalidarToken
} = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [
        //* Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es requerido').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({
            min: 6
        }),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        //* Middlewares
        check('email', 'El email es requerido').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({
            min: 6
        }),
        validarCampos
    ],
    loginUsuario);

router.get(
    '/',
    [
        //* Middlewares
        validarJWT
    ],
    revalidarToken
);

module.exports = router;