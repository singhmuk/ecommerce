const express = require('express');
const router = express.Router();
const productSchems = require('../controllers/products')

router.route("/").post(productSchems)
router.route("/").get(productSchems)
router.route("/:id").get(productSchems.getById)
// router.route("/").get(productSchems.getname)


module.exports = router;