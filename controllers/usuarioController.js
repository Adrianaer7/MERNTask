const Usuario = require("../models/Usuario")
const bcryptjs = require('bcryptjs');
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

exports.crearUsuario = async (req, res) => {
    
    //Revisar si hay errores. Las reglas van en el routing pero se leen aca
    const errores = validationResult(req)    //si hay algun error, genera el arreglo errors
    if(!errores.isEmpty()) {   //si hay errores, el usuario no se crea
        return res.status(400).json({errores: errores.array()})   //devuelve un un array llamado errores, que contiene el campo al que se le asigna el error y el msj de error
    }

    //Extraer email y password
    const {email, password} = req.body

    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email})

        if(usuario) {   //si ya existia un usuario con el mismo email, no se inserta el nuevo usuario
            return res.status(400).json({msg: "El usuario ya existe"})
        }

        //Crear el nuevo usuario
        usuario = new Usuario(req.body) //revisa los datos json que cargué en Postman en body. 

        //Hashear el password
        const salt = await bcryptjs.genSalt(10) //crea un hash
        usuario.password = await bcryptjs.hash(password, salt) //sobreescribe la password con el salt(hash) creado y lo guarda

        //Guardar el nuevo usuario
        await usuario.save()

        //Crear el JWT
        const payload = {
            usuario: {
                id: usuario.id  //cuando inicie sesion el usuario con tal id, podra hacerse la consulta a la bd y traer los proyectos creados por él
            }
        }
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {    //el .sign es firmarlo.
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error

            //Mensaje de confirmacion
            return res.json({token})
        })

    } catch (error) {
        console.log(error)
        res.status(400).send("Hubo un error")   //si hubo un error al insertar un registro, muestra el msj. El 400 es porque es un error del usuario
    }
}