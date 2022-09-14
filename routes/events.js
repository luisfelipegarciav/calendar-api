/*
    Rutas de Eventos
    host + /api/events
*/
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    getEventos,
} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// Todas las peticiones tienen que pasar por la validacion del JWT
//* la posicion de este middleware importa!!!
router.use(validarJWT);

// Obtener eventos
router.get(
    '/',
    getEventos
);


// Crear un evento nuevo
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de inicio es obligatorio').custom(isDate),
        validarCampos
    ],
    crearEvento
);

// Actualizar evento
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de inicio es obligatorio').custom(isDate),
        validarCampos
    ],
    actualizarEvento
);

// Eliminar evento
router.delete(
    '/:id',
    eliminarEvento
);

module.exports = router;