const Tarea = require("../models/Tarea")
const Proyecto = require("../models/Proyecto")
const {validationResult} = require("express-validator")


//Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revisar si hay errores. Las reglas van en el routing pero se leen aca
    const errores = validationResult(req)    //si hay algun error, genera el arreglo errors
    if(!errores.isEmpty()) {   //si hay errores, el usuario no se crea
        return res.status(400).json({errores: errores.array()})   //devuelve un un array llamado errores, que contiene el campo al que se le asigna el error y el msj de error
    }

    try {
        //Extraer el proyecto
        const {proyecto} = req.body

        //Comprobar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto)    //pongo el proyecto entero en existeProyecto
        if(!existeProyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"})
        }

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {    //si el id del creador del proyecto que tengo es distinto a la id del usuario autenticado
            return res.status(401).json({msg: "No autorizado"})
        }

        //Crear tarea
        const tarea = new Tarea(req.body)
        await tarea.save()
        res.json({tarea})

    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error")
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer el proyecto
        const {proyecto} = req.query    //el req.query va a tomar el id del proyecto que le paso en params en obtenerTareas del tareaState

        //Comprobar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto)    //pongo el proyecto entero en existeProyecto
        if(!existeProyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"})
        }

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {    //si el id del creador del proyecto que tengo es distinto a la id del usuario autenticado
            return res.status(401).json({msg: "No autorizado"})
        }

        //obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: -1}) //trae todas las tareas que tengan el id del proyecto que pongo en el req.query yl as ordeno
        res.json({tareas})

    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error")
    }
}

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto
        const {nombre, estado, proyecto} = req.body

        //si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id) //obtengo la tarea entera segun el id de la tarea que pongo en la url del postman
        if(!tarea) {
            return res.status(404).json({msg: "No existe esa tarea"})

        }

        //Comprobar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto) 
        
        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {    //si el id del creador del proyecto que tengo es distinto a la id del usuario autenticado
            return res.status(401).json({msg: "No autorizado"})
        }

        //verificar que la tarea a modificar sea correspondiente al proyecto que la creó
        if (tarea.proyecto.toString() !== proyecto) {   //tarea.proyecto tiene el id del proyecto. El campo proyecto viene del req.body
            return res.status(401).json({msg: 'Esta tarea no pertenece a este proyecto'});
        }

        //crear un nuevo objeto con la nueva informacion
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre  //cada vez que modifique nombre, se va a ir colocando en nuevaTarea
        nuevaTarea.estado = estado  //cada vez que modifique estado, se va a ir colocando en nuevaTarea
        

        //guardar la tarea
        tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, nuevaTarea, {new: true})    //actualizar proyectos está hecho con algunas cosas diferentes, pero son validos los 2 metodos
        res.json({tarea})

    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error")
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto
        const {proyecto} = req.query

        //si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id) //le paso la tarea entera
        if(!tarea) {
            return res.status(404).json({msg: "No existe esa tarea"})
        }

        //Comprobar si existe el proyecto
        const existeProyecto = await Proyecto.findById(tarea.proyecto)  //le paso el proyecto entero

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {    //si el id del creador del proyecto que tengo es distinto a la id del usuario autenticado
            return res.status(401).json({msg: "No autorizado"})
        }

        //eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id})
        res.json({msg: "Tarea eliminada"})
        

    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error")
    }
}