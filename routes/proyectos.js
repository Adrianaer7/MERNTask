const express = require("express")
const router = express.Router()
const proyectoController = require("../controllers/proyectoController")
const auth = require("../middleware/auth")
const {check} = require("express-validator")


//Crea un proyecto
//se recibe una request de tipo post a api/proyectos
router.post("/",
    auth,   //para poder crear proyectos, el usuario debe estar autenticado
    [
        check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()    //para poder crear un proyecto, es necesario que tenga nombre
    ],
    proyectoController.crearProyecto
)

//Obtengo la lista de proyectos
router.get("/",
    auth,   //para poder ver los proyectos creados por él, el usuario debe estar autenticado
    proyectoController.obtenerProyectos
)

//Actualizar proyecto via ID
router.put("/:id",
    auth,
    [
        check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()    //para actualizar un proyecto, es necesario que tenga nombre
    ],
    proyectoController.actualizarProyecto
)

//Eliminar proyecto via ID
router.delete("/:id",
    auth,
    proyectoController.eliminarProyecto
)

module.exports = router;