const router = require("express").Router();
const dishesController = require("./dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

const ordersRouter = require("../orders/orders.router")

// /dishes routes


router.route("/")
    .get(dishesController.list)
    .all(methodNotAllowed)

module.exports = router;
