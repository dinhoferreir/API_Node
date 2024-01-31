const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { cadastrarUsuarios, loginUsuario } = require('../controllers/usuarios-controller');

// const UsuariosController = require('../controllers/usuarios-controller')
// const UsuariosController = require('../controllers/usuarios-controller')
// const UsuarioLogin = require('../controllers/usuarios-controller')


router.post('/cadastro', cadastrarUsuarios );

router.post('/login', loginUsuario)


module.exports = router;