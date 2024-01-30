const express = require('express');
const router = express.Router()

// RETORNA TODOSO OS PEDITOS
router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    })
})

//INSERE UM PEDIDOS
router.post('/', (req, res, next)=>{
    const pedido = {
        id_produto : req.body.id_produto,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
        mensagem: 'O pedido atual foi criado',
        pedidoCriado: pedido
    })
})

// RETORNA DADOS DE UM PEDIDO
router.get('/:id_pedidos', (req, res, next)=>{
    const id = req.params.id_pedidos
    res.status(200).send({
        mensagem: 'Detalhes do pedido',
        id: id
    })
})

// // ALTERA UM PEDIDOS
// router.patch('/', (req, res, next)=>{
//     res.status(200).send({
//         mensagem: 'Usnado o PATCH dentro da rota de pedidos'
//     })
// })

// DELETA UM PEDIDO
router.delete('/', (req, res, next)=>{
    res.status(200).send({
        mensagem: 'Pedido excluido'
    })
})

module.exports = router