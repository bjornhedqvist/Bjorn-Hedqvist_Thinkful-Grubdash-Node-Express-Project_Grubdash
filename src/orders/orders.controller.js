const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

function list(req, res, next) {
  res.json({ data: orders });
}

function isValidOrder(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const { foundOrder } = res.locals;
  if (!deliverTo || deliverTo === "") {
    return next({ status: 400, message: "Order must include a deliverTo" });
  } else if (!mobileNumber || mobileNumber === "") {
    return next({ status: 400, message: "Order must include a mobileNumber" });
  } else if (!dishes) {
    return next({ status: 400, message: "Order must include a dish" });
  } else if (Array.isArray(dishes).length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  dishes.forEach((dish,index) => {
    if (
      !dish.quantity ||
      Number.isInteger(dish.quantity) === false ||
      Number(dish.quantity) > 0
    ) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  return next();
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function findOrder(req, res, next) {
    const { orderId } = req.params;
    let foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.foundOrder = foundOrder;
        return next();
    }
    next({ status: 404, message: `Order Id: ${orderId} not found` });
}

function read(req, res, next) {
    const { foundOrder } = res.locals;
    res.json({ data: foundOrder });
}

module.exports = {
  list,
  create: [isValidOrder, create],
  read: [findOrder, read],
  //   update: [findDish, isValidDish, update],
  // urlExists,
};
