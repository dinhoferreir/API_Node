const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')


const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
// const rotaUsuarios = require('./routes/usuarios');

app.use(morgan('dev'))
// liberando a pasta uploads para ser acessível pelo caminha path
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))// apenas dados simples
app.use(bodyParser.json()); // apenas formato json de entrada no body

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
// app.use('/usuarios', require('./routes/usuarios'));


app.use((req, res, next)=>{
    res.header('Access-Control-Allow_Origin', '*')
    res.header('Access-Control-Allow_Header', 
    'Content-Type, Origin, X-Requrested-With, Accept, Authorization'
    )
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({})
    }
    next();
})

// app.use(router)
// app.use('/nda')
// app.use('/myus', rotaUsuarios);

// Quando não encontra rota
app.use((req, res, next)=>{
    const erro = new Error('O caminho não foi encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})


module.exports = app;

