const express = require('express');
const router = express.Router();
const productSchems = require('../controllers/products')

router.route("/").post(productSchems)
router.route("/").get(productSchems)
router.route("/:id").get(productSchems.getById)
// router.route("/").get(productSchems.getname)
router.route("/:id").put(productSchems.updates)
// router.route("/counts").get(productSchems.getDocs)
router.route("/features").get(productSchems.getFeatures)


module.exports = router;