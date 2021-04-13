const Mensaje = require('../models/mensaje')

const obtenerChat = async (req, res) => {
    const miId = req.uid;
    const mensajedDe = req.params.de;

    const last30 = await Mensaje.find({
        $or: [{ de: miId, para: mensajedDe }, { de: mensajedDe, para: miId }]
    })
        .sort({ createdAt: 'desc' })
        .limit(30);

    res.json({
        oh: true,
        mensajes: last30
    })
}

module.exports = {
    obtenerChat
}