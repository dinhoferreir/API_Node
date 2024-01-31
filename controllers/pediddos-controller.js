const mysql = require('../mysql').pool
require("dotenv").config();
const MYHOST2 = process.env.NODE_HOST2

exports.getPedidos =  (req, res, next) =>{
    mysql.getConnection((error, conn)=>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `SELECT 	pedidos.id_pedidos,
                        pedidos.quantidade,
                        produtos.id_produtos,
                        produtos.nome,
                        produtos.preco
                FROM 	pedidos
            INNER JOIN	produtos
                    ON	produtos.id_produtos = pedidos.id_produto`,
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            id_pedidos: pedido.id_pedidos,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produtos: pedido.id_produtos,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido especifico',
                                url: MYHOST2 + pedido.id_pedidos
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
};
exports.postPedidos = (req, res, next)=>{
    // const pedido = {
    //     id_produto : req.body.id_produto,
    //     quantidade: req.body.quantidade
    // }
    // res.status(201).send({
    //     mensagem: 'O pedido atual foi criado',
    //     pedidoCriado: pedido
    // })
    mysql.getConnection((error, conn)=>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT *FROM produtos WHERE id_produtos = ?',
            [req.body.id_produto], (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}
                if (result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    })
                }
                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)', 
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, field) =>{
                        conn.release();
                        if(error) { return res.status(500).send({error: error})}
                        const response = {
                            mensagem: 'Pedido inserido com sucesso',
                            pedidoCriadp: {
                                id_pedidos: result.id_pedidos,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os pedidos',
                                    url: MYHOST2
                                }
                            }
                        }
                        // res.status(201).send({                    
                        //     mensagem: 'O produto foi inserido com sucesso!',
                        //     id_produto: result.insertId
                        // })
                        return res.status(201).send(response)
                    }
                )
            })
    });
};

exports.getUmPedido = (req, res, next)=>{
    // const id = req.params.id_pedidos
    // res.status(200).send({
    //     mensagem: 'Detalhes do pedido',
    //     id: id
    // })
    mysql.getConnection((error, conn)=>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedidos],
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}
                if (result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o pedido com esse ID'
                    })
                }
                const response = {
                    pedido: {
                        id_pedidos: result[0].id_pedidos,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: MYHOST2
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.deletePedido =  (req, res, next)=>{
    // res.status(200).send({
    //     mensagem: 'Pedido excluido'
    // })
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM pedidos WHERE id_pedidos = ?`,[ req.body.id_pedidos],
            (error, result, field) =>{
                conn.release();
                // if (error){
                //     return res.status(500).send({
                //         error: error,
                //         response: null
                //     })
                // }
                if(error) { return res.status(500).send({error: error})}
                const response= {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um novo pedido',
                        url: MYHOST2,
                        body: {
                            id_produto: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}