const express = require('express');
const router = express.Router()
require("dotenv").config();
const PedidosController = require('../controllers/pediddos-controller')

// RETORNA TODOSO OS PEDITOS
router.get('/', PedidosController.getPedidos)
//INSERE UM PEDIDOS
router.post('/', PedidosController.postPedidos)
// RETORNA DADOS DE UM PEDIDO
router.get('/:id_pedidos', PedidosController.getUmPedido)
// DELETA UM PEDIDO
router.delete('/', PedidosController.deletePedido)

module.exports = router