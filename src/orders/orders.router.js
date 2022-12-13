const router = require("express").Router();
const ordersController = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

const ordersRouter = require("../orders/orders.router")

// /orders routes
router.route("/:orderId")
    .get(ordersController.read)
    .put(ordersController.update)
    .delete(ordersController.delete)
    .all(methodNotAllowed)

router.route("/")
    .get(ordersController.list)
    .post(ordersController.create)
    .all(methodNotAllowed)

module.exports = router;
