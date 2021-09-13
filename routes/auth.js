//Rutas para autenticar usuarios
const express = require("express")
const router = express.Router()
const {check} = require("express-validator")
const authController = require("../controllers/authController")
const auth = require("../middleware/auth")

//Iniciar sesion
//se recibe una request de tipo post a api/auth
router.post("/",
    authController.autenticarUsuario
)

//Obtiene el usuario autenticado
//se recibe una request de tipo get a api/auth
router.get("/",
    auth,
    authController.usuarioAutenticado
)

module.exports = router;