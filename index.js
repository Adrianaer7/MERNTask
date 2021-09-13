//Importacion
const express = require("express")
const conectarDB = require("./config/db")
const cors = require("cors")

//Crear el servidor express
const app = express()

//Conectar a la base de datos
conectarDB()    //ejecuto la funcion que está en db.js

//habilitar cors
app.use(cors({ credentials: true, origin: true })); //para que no moleste el cartel de cors de chrome en la consola
app.options("*", cors());

//Habilitar express.json
app.use(express.json({extended: true}))

//Puerto de la app. Cuando haga el deployment en Heroku se espera que la variable de entorno se llame PORT
const port = process.env.port || 4000;   //Si existe process.env.PORT, entonces se asigna el puerto, sino, se asigna puerto 4000. Puede ser cualquier numero menos el puerto del cliente que es 3000

//Importar rutas
app.use("/api/usuarios", require("./routes/usuarios"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/proyectos", require("./routes/proyectos"))
app.use("/api/tareas", require("./routes/tareas"))

//Arrancar la app
app.listen(port, "0.0.0.0", () => { //al puerto y al dominio lo va a asignar Heroku
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})