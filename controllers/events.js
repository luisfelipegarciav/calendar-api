const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {
    try {

        const eventos = await Evento.find()
            .populate('user', { name: 1 });

        res.json(
            {
                ok: true,
                eventos
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener la lista de eventos'
        })
    }
}

const crearEvento = async (req, res = response) => {

    try {

        const evento = new Evento(req.body)

        evento.user = req.uid;

        const nuevoEvento = await evento.save();

        res.json(
            {
                ok: true,
                evento: nuevoEvento
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el evento'
        })
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento inexistente'
            })
        }

        if (evento.user.toString() != uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio necesario'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json(
            {
                ok: true,
                evento: eventoActualizado
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo actualizar el evento'
        })
    }

}

const eliminarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento inexistente'
            })
        }

        if (evento.user.toString() != uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio necesario'
            })
        }

        await Evento.findByIdAndDelete(eventoId);

        res.json(
            {
                ok: true
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el evento'
        })
    }
}

module.exports = {
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    getEventos,
}