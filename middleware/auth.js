const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
    //Leer el token del header del usuario ya creado
    const token = req.header("x-auth-token")    //le puedo poner el nombre que quiera

    //Revisar si no hay token. Si no hay token es porque el usuario no se ha autenticado al momento de crear un proyecto
    if(!token) {
        return res.status(401).json({msg: "No hay token. Permiso no valido"})  
    }

    //Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA)    //nos permite verificar el token. En cifrado se va a almacenar la id del usuario que creó el proyecto, el momento en el que se creó el usuario y su fecha de expiracion
        req.usuario = cifrado.usuario   //el req.usuario guarda el id del usuario que creó el proyecto o tarea
        next()  //para que se valla al siguiente middleware
    } catch (error) {
        console.log(error)
        res.status(401).json({msg: "Token no valido"})  //por si manda un token que expiró, o intenta adivinar el token
    }
}