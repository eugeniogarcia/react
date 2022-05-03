const express = require('express')
const publica = require('./publisher')
var cors = require('cors')

const app = express()
const port = 3000


//Opciones de CORS. Acepta https://mbp.local
var corsOptions = {
    origin: 'https://mbp.local:5000',
    optionsSuccessStatus: 200 // 
}

app.use(cors(corsOptions)) //habilita el CORS para todas las rutas

app.use(express.json());

publica(app,"/push/");

app.get('/', (req, res) => {
    res.send('Welcome to the Publisher Server!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
