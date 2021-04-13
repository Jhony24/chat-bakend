const { comprobarjwt } = require('../helpers/jwt');
const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
const { usuarioConectado, usuarioDeconectado, grabarMensaje } = require('../controllers/socket')

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Sin Bandera'));


//  Mensaaje de Socket
io.on('connection', async client => {
    console.log("Cliente conectado")

    const [valido, uid] = comprobarjwt(client.handshake.headers['x-token'])

    //vERIFICAR AUTENTICACION
    if (!valido) {
        return client.disconnect();
    }

    //Cliene Autentcad
    usuarioConectado(uid);


    //Ingresra al usuairo a una sala en particular
    //Sala global
    client.join(uid);

    //escuahr mensaje persoan

    client.on('mensaje-personal', async (payload) => {

        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    })


    //client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        usuarioDeconectado(uid);
    });

    /*client.on('mensaje', (payload) => {
        console.log('mensaje!!!!!!!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });*/


    client.on('vote-band', payload => {

        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', payload => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());

    });

    client.on('delete-band', payload => {

        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });
    /*client.on('emitir-mensaje', (payload) => {
        //io.emit('nuevo-mensaje',payload); //emite a todos 
        client.broadcast.emit('nuevo-mensaje', payload); //emite a todos menos al q lo emitio
    });*/
});

