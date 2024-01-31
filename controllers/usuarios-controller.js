require("dotenv").config();
const mysql = require('../mysql')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.cadastrarUsuarios = async(req, res, next)=>{
    try {
        const query = 'INSERT INTO usuarios (email, senha) VALUES (?,?)'
        const query1 = 'SELECT * FROM usuarios WHERE email = ?'
        const results1 = await mysql.execute(query1,[req.body.email])
        // if(error){return res.status(500).send({error: error})}
        if(results1.length > 0){
            res.status(409).send({mensagem: 'Usuario já cadastrado'})
        }else{
            bcrypt.hash(req.body.senha, 10, async(errBcrypt, hash)=>{
                if(errBcrypt){return res.status(500).send({error: errBcrypt})}
                const results2 = await mysql.execute(query,[req.body.email, hash])
                response = {
                    mensagem: 'Usuario criado com sucesso',
                    usuarioCriado: {
                        id_usuario: results2.insertId,
                        email: req.body.email
                    }
                }
                return res.status(201).send(response)
                        
            })

        }
    } catch (error) {
        return res.status(500).send({error: error})
    }
}

exports.loginUsuario = async (req, res, next)=>{
    const query = 'SELECT * FROM usuarios WHERE email = ?'
    const results = await mysql.execute(query,[req.body.email])
    if (results.length < 1){
        return res.status(401).send({mensagem: 'Falha na autenticação'})
    }
    bcrypt.compare(req.body.senha, results[0].senha, (err, result)=>{
        if(err){
            return res.status(401).send({mensagem: 'Falha na autenticação'})
        }
        if (result){
            const token = jwt.sign({
                id_usuario: results[0].id_usuario,
                email: results[0].email
            }, process.env.JWT_KEY,{
                expiresIn: "1h"
            } )
            return res.status(200).send({
                mensagem: 'Autenticado com sucesso!',
                token: token
            })
        }
        return res.status(401).send({mensagem: 'Falha na autenticação'})
    })
    
    // mysql.getConnection((err, conn)=>{
    //     if(err){ return res.status(500).send({error: err})}
    //     conn.query(query, [], (error, results, fields)=>{
    //         conn.release()
    //         if (error){return res.status(500).send({error: error})}
            
    //     })
    // })
}




//XXXXXXXXXXXXXXXXXXXXXXXXXXXX FUNCIONANDO COM MYSQL.POOL XXXXXXXXXXXXXXXXXXXXXXXXXXXX
// exports.cadastrarUsuarios = async(req, res, next)=>{
// mysql.getConnection((err, conn)=>{
//     if (err){return res.status(500).send({error: error})}
//     conn.query('SELECT * FROM usuarios WHERE email = ?', 
//     [req.body.email], (error, results) =>{
//         if(error){return res.status(500).send({error: error})}
//         if(results.length > 0){
//             res.status(409).send({mensagem: 'Usuario já cadastrado'})
//         }else{
//             bcrypt.hash(req.body.senha, 10, (errBcrypt, hash)=>{
//                 if(errBcrypt){return res.status(500).send({error: errBcrypt})}
//                 conn.query(
//                     'INSERT INTO usuarios (email, senha) VALUES (?,?)',
//                     [req.body.email, hash],
//                     (error, results)=>{
//                         conn.release();
//                         if(error){return res.status(500).send({error: error})}
//                         response = {
//                             mensagem: 'Usuario criado com sucesso',
//                             usuarioCriado: {
//                                 id_usuario: results.insertId,
//                                 email: req.body.email
//                             }
//                         }
//                         return res.status(201).send(response)
//                     })
//             })
//         }
//     })
// })
// }


// exports.loginUsuario = (req, res, next)=>{
//     mysql.getConnection((err, conn)=>{
//         if(err){ return res.status(500).send({error: err})}
//         const query = 'SELECT * FROM usuarios WHERE email = ?'
//         conn.query(query, [req.body.email], (error, results, fields)=>{
//             conn.release()
//             if (error){return res.status(500).send({error: error})}
//             if (results.length < 1){
//                 return res.status(401).send({mensagem: 'Falha na autenticação'})
//             }
//             bcrypt.compare(req.body.senha, results[0].senha, (err, result)=>{
//                 if(err){
//                     return res.status(401).send({mensagem: 'Falha na autenticação'})
//                 }
//                 if (result){
//                     const token = jwt.sign({
//                         id_usuario: results[0].id_usuario,
//                         email: results[0].email
//                     }, process.env.JWT_KEY,{
//                         expiresIn: "1h"
//                     } )
//                     return res.status(200).send({
//                         mensagem: 'Autenticado com sucesso!',
//                         token: token
//                     })
//                 }
//                 return res.status(401).send({mensagem: 'Falha na autenticação'})
//             })
//         })
//     })
// }
//XXXXXXXXXXXXXXXXXXXXXXXXXXXX FUNCIONANDO COM MYSQL.POOL XXXXXXXXXXXXXXXXXXXXXXXXXXXX







// exports.cadastrarUsuarios = async(req, res, next)=>{
//     try {
//         const query =  'SELECT * FROM usuarios WHERE email = ?'
//         await bcrypt.hash(req.body.senha, 10, async(errBcrypt, hash)=>{
//             if(errBcrypt){ return res.status(500).send({error: errBcrypt})}
//             const result = await mysql.execute(query, [req.body.email])
//             response = {
//                 mensagem: 'Usuario cadastrado com sucesso',
//                 usuarioCriado: {
//                     id_usuario: results.insertId,
//                     email: req.body.email
//                 }
//             }
//             return res.status(201).send(response)
//         })
        
//     } catch (error) {
//         // return res.status(500).send({err: err})
//         return res.status(500).send({error: errBcrypt})
//     }
    
// };

// // mysql.getConnection((err, conn)=>{
// //     if(err) { }
// //     conn.query(, , (error, results)=>{
// //         if(error) { return res.status(500).send({error: errBcrypt})}
// //         if (results.length > 0){
// //             res.status(409).send({mensagem: "Usuário já cadastrado"})
// //         } else{
// //             bcrypt.hash(req.body.senha, 10, (errBcrypt, hash)=>{
// //                 if(errBcrypt){ return res.status(500).send({error: errBcrypt})}
// //                     conn.query(
// //                         `INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
// //                         [req.body.email, hash],
// //                         (error, results)=>{
// //                             conn.release();
// //                             if(error) { return res.status(500).send({error: errBcrypt})}
// //                             response = {
// //                                 mensagem: 'Usuario cadastrado com sucesso',
// //                                 usuarioCriado: {
// //                                     id_usuario: results.insertId,
// //                                     email: req.body.email
// //                                 }
// //                             }
// //                             return res.status(201).send(response)
// //                         }
// //                     )
// //             })
// //         }
// //     })
// // })


// exports.loginUsuario = (req, res, next)=>{
//     mysql.getConnection((error, conn)=>{
//         if(error) { return res.status(500).send({error: error})}
//         const query = `SELECT * FROM usuarios WHERE email = ?`;
//         conn.query(query, [req.body.email], (error, results, fields)=>{
//             conn.release()
//             if(err) { return res.status(500).send({err: err})}
//             if(results.length < 1){
//                 return res.status(401).send({mensagem: 'Falha na autenticação'})
//             }
//             bcrypt.compare(req.body.senha, results[0].senha, (err, result)=>{
//                 if (result){
//                     const token = jwt.sign({
//                         id_usuario: results[0].id_usuario,
//                         email: results[0].email
//                     },
//                     process.env.JWT_KEY,
//                     {
//                         expiresIn: "1h"
//                     })
//                     return res.status(200).send({
//                         mensagem: 'Autenticado com Sucesso!',
//                         token: token
//                     })
//                 }
//                 return res.status(401).send({mensagem: 'Falha na autenticação'})
//             })
//         })
//     });
// }
