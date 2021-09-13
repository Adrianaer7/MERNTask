const mongoose = require("mongoose")

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true  //elimina los espacios en blanco    
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,    //es el id del usuario que le paso en el proyectoController
        ref: "Usuario"  //Tiene que tener el mismo nombre que el module.exports de abajo del modelo que le queremos pasar. De esta forma va a saber qué le estoy pasando
    },
    creado: {
        type: Date,
        default: Date
    }
})

module.exports = mongoose.model("Proyecto", ProyectoSchema)