const Usuario = require("../models/Usuario")
const bcryptjs = require('bcryptjs');
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores. Las reglas van en el routing pero se leen aca
    const errores = validationResult(req)    //si hay algun error, genera el arreglo errors
    if(!errores.isEmpty()) {   //si hay errores, el usuario no se crea
        return res.status(400).json({errores: errores.array()})   //devuelve un un array llamado errores, que contiene el campo al que se le asigna el error y el msj de error
    }

    //extraer el email y password
    const {email, password} = req.body

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email})
        if(!usuario) {
            return res.status(400).json({msg: "El usuario no existe"})
        }

        //Revisar que el password sea correcto
        const passCorrecto = await bcryptjs.compare(password, usuario.password) //compara el password que estoy ingresando con el password que está en la bd
        if(!passCorrecto) {  //si el password es incorrecto
            return res.status(400).json({msg: "Contraseña incorrecta"})
        }
        
        //Si todo es correcto,
        //Crear el JWT
        const payload = {
            usuario: {
                id: usuario.id  //cuando inicie sesion el usuario con tal id, podra hacerse la consulta a la bd y traer los proyectos creados por él
            }
        }
        
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {    //el .sign es firmarlo.
            expiresIn: "30d" //este token expira cuando le indique. Para desarrollo lo voy a tener valido por varios dias
        }, (error, token) => {
            if(error) throw error

            //Mensaje de confirmacion
            res.json({token})
        })

    } catch (error) {
        console.log(error)
    }
}

//Obtiene qué usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select("-password")  //obtiene toda la info del usuario, menos la contraseña
        res.json({usuario})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Hubo un error"})
    }
}