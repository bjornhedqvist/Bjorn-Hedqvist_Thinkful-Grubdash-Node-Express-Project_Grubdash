const router = require("express").Router();
const dishesController = require("./dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

const ordersRouter = require("../orders/orders.router")

// /dishes routes
router.route("/:dishId")
    .get(dishesController.read)
    .put(dishesController.update)
    .all(methodNotAllowed)

router.route("/")
    .get(dishesController.list)
    .post(dishesController.create)
    .all(methodNotAllowed)

module.exports = router;
