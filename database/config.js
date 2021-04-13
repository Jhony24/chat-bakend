const mongosse = require('mongoose');

const dbConnection = async () => {

    try {

       await mongosse.connect(process.env.DB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true
        });

        console.log("DB Online");

    } catch (error) {
        console.log(error);
        throw new Error("Error en la base de datos");
    }
}


module.exports = {
    dbConnection
}