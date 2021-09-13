const mongoose = require("mongoose")

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    creado: {
        type: Date,
        default: new Date().toLocaleString("en-US", {timeZone: "Chile/EasterIsland"})


    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    }
})

module.exports = mongoose.model("Tarea", TareaSchema)