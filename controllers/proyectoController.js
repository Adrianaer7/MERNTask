const Proyecto = require("../models/Proyecto")
const Tarea = require('../models/Tarea');
const {validationResult} = require("express-validator")

//Crear un proyecto
exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores. Las reglas van en el routing pero se leen aca
    const errores = validationResult(req)    //si hay algun error, genera el arreglo errors
    if(!errores.isEmpty()) {   //si hay errores, el usuario no se crea
        return res.status(400).json({errores: errores.array()})   //devuelve un un array llamado errores, que contiene el campo al que se le asigna el error y el msj de error
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body)

        //Guardar el usuario que crea el proyecto con JWT
        proyecto.creador = req.usuario.id   //tomo el id de auth.js del middleware y lo coloco en el campo "creador" del modelo Proyecto

        //Guardar nuevo proyecto
        proyecto.save()
        res.json({proyecto})  //el postman me muestra el proyecto que el usuario cargó

    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error")   //el 500 es porque el error es del servidor
    }
}


//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1})    //obtiene los proyectos que fueron creados por el usuario que actualmente esta autenticado. Los ordeno, el mas reciente arriba
        res.json({proyectos})

    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error")
    }
}


//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {

    //Revisar si hay errores. Las reglas van en el routing pero se leen aca
    const errores = validationResult(req)    //si hay algun error, genera el arreglo errors
    if(!errores.isEmpty()) {   //si hay errores, el usuario no se crea
        return res.status(400).json({errores: errores.array()})   //devuelve un un array llamado errores, que contiene el campo al que se le asigna el error y el msj de error
    }

    //extraer la informacion del proyecto
    const {nombre} = req.body
    const nuevoProyecto = {}

    if(nombre) nuevoProyecto.nombre = nombre   //cada vez que modifique nombre, se va a ir colocando en nombreProyecto

    try {
        //revisar por ID si el proyecto existe
        let proyecto = await Proyecto.findById(req.params.id)   //consigo el proyecto entero colocando su id en la url en postman y lo coloco en proyecto

        //si el proyecto no existe
        if(!proyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"})
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {    //si el id del creador del proyecto que tengo es distinto a la id del usuario autenticado
            return res.status(401).json({msg: "No autorizado"})
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true})   //tomo el proyecto por su id que le estoy pasando en la url, y con el set coloco lo que hay en nuevoproyecto en proyecto. _id es el nombre del campo del id del objeto creado
        res.json({proyecto})

    } catch (error) {
        console.log(error)
        res.status(500).send("Error en el servidor")
    }
}

//Eliminar proyecto por ID
exports.eliminarProyecto = async (req, res) => {
    try {
        //revisar por ID si el proyecto existe
        let proyecto = await Proyecto.findById(req.params.id)   //consigo el proyecto entero colocando su id en la url en postman y lo coloco en proyecto

        //si el proyecto no existe
        if(!proyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"})
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {    //si el id del creador del proyecto que tengo es distinto a la id del usuario autenticado
            return res.status(401).json({msg: "No autorizado"})
        }

        //eliminar
        await Tarea.deleteMany({ proyecto: req.params.id });    //si quiero eliminar el proyecto, elimino las tareas que tiene
        await Proyecto.findOneAndRemove({_id: req.params.id})   //elimino el proyecto
        res.json({msg: "Proyecto eliminado"})

    } catch (error) {
        console.log(error)
        res.status(500).send("Error en el servidor")
    }
}