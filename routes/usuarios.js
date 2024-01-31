const express = require('express');
const router = express.Router();
// const mysql = require('../mysql').pool
// const bcrypt = require('bcrypt');
// const { response } = require('../App');
// require("dotenv").config();

// router.post('/cadastro', (req, res, next)=>{
//     mysql.getConnection((err, conn)=>{
//         if(err) { return res.status(500).send({err: err})}
//         bcrypt.hash(req.body.senha, 10, (errBcrypt, hash)=>{
//             if(errBcrypt){ return res.status(500).send({error: errBcrypt})}
//                 conn.query(
//                     `INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
//                     [req.body.email, hash],
//                     (error, results)=>{
//                         conn.release();
//                         if(error) { return res.status(500).send({error: errBcrypt})}
//                         response = {
//                             mensagem: 'Usuario cadastrado com sucesso',
//                             usuarioCriado: {
//                                 id_usuario: results.insertId,
//                                 email: req.body.email
//                             }
//                         }
//                         return res.status(201).send(response)
//                     }
//                 )
//         })
//     })
// })

// module.exports = router;