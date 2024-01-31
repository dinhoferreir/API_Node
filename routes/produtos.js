const express = require('express');
const router = express.Router()
require("dotenv").config();
const multer = require('multer')
const datas = new Date().getTime()
const login = require('../middleware/login')
const ProdutosController = require('../controllers/produtos-controller')
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
router.get('/', ProdutosController.getProdutos)
//INSERE UM PRODUTO
router.post(
    '/', login.required, upload.single('produto_imagem'), 
    ProdutosController.postProdutos
)
// RETORNA DADOS DE UM PRODUTO
router.get('/:id_produto', ProdutosController.getUmProduto )
// ALTERA UM PRODUTO
router.patch('/', login.required, ProdutosController.updatesProduto)
// DELETA UM PRODUTO
router.delete('/',login.required, ProdutosController.deleteProduto)

module.exports = router