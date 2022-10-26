const express = require('express');
const router = express.Router();
const productSchems = require('../controllers/products')

router.route("/").post(productSchems)
router.route("/").get(productSchems)


module.exports = router;