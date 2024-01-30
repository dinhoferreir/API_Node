const express = require('express');
const router = express.Router()
const mysql = require('../mysql').pool
require("dotenv").config();
const multer = require('multer')
const datas = new Date().getTime()

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        // cb(null, new Date().toISOString() + file.originalname)
        cb(null, datas + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        )
        {
            cb(null, true)
        }else{
            cb(null, false)
        }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

// RETORNA TODOSO OS PRODUTOS
const MYHOST = process.env.NODE_HOST
router.get('/', (req, res, next) =>{
    // res.status(200).send({
    //     mensagem: 'Retorna os produtos'
    // })
    mysql.getConnection((error, conn)=>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produtos: prod.id_produtos,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: MYHOST + prod.id_produtos
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })

})

//INSERE UM PRODUTO
router.post('/', upload.single('produto_imagem') ,(req, res, next)=>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)', 
            [
                req.body.nome, 
                req.body.preco,
                req.file.path
            ],
            (error, result, field) =>{
                conn.release();
                // if (error){
                //     return res.status(500).send({
                //         error: error,
                //         response: null
                //     })
                // }
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produtos: result.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: MYHOST
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
})


// router.get('/:id_pad/', (req, res, next)=>{
//     res.status(200).send({
//         mensagem: {
//            msg: datas
//         }
//     })
// })
// RETORNA DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?;',
            [req.params.id_produto],
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error})}
                // return res.status(200).send({response: resultado})
                if (result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com esse ID'
                    })
                }
                const response = {
                    produto: {
                        id_produtos: result[0].id_produtos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: MYHOST
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
})

// ALTERA UM PRODUTO
router.patch('/', (req, res, next)=>{
    // res.status(200).send({
    //     mensagem: 'Produto alterado'
    // })
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE produtos
                SET nome = ?,
                    preco = ?
                WHERE id_produtos = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produtos
            ],
            (error, result, field) =>{
                conn.release();
                // if (error){
                //     return res.status(500).send({
                //         error: error,
                //         response: null
                //     })
                // }
                if(error) { return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produtos: req.body.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto especifico',
                            url: MYHOST + req.body.id_produtos
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
})

// DELETA UM PRODUTO
router.delete('/', (req, res, next)=>{
    // res.status(200).send({
    //     mensagem: 'Produto excluido'
    // })
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM produtos WHERE id_produtos = ?`,[ req.body.id_produtos],
            (error, resultado, field) =>{
                conn.release();
                // if (error){
                //     return res.status(500).send({
                //         error: error,
                //         response: null
                //     })
                // }
                if(error) { return res.status(500).send({error: error})}
                const response= {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um novo produto',
                        url: MYHOST,
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }

                    }
                }
                return res.status(202).send(response)
            }
        )
    })
})

module.exports = router