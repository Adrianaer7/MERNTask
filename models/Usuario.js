//Importacion
const mongoose = require("mongoose")

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true  //elimina los espacios en blanco innecesarios 
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now() //nos genera una fecha en el momento en el que el usuario se registra
    }
})

module.exports = mongoose.model("Usuario", UsuariosSchema)  //Si todavia no fue creado ningun usuario, MongoDB crea automaticamente colecciones de nuestro registro. En este caso seria usuarios