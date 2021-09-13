//Rutas para crear usuarios
const express = require("express")
const router = express.Router()
const {check} = require("express-validator")
const usuarioController = require("../controllers/usuarioController")

//Crea un usuario. Esto es un Middleware
//se recibe una request de tipo post a api/usuarios
router.post("/", 
    [   //la validacion tambien está hecha en react
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo no es valido ').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ],
    usuarioController.crearUsuario  //ejecuta la funcion que viene de usuarioController
)

module.exports = router;