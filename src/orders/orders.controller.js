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
  } else if (dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  } else if (Array.isArray(dishes) === false) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  } else if (dishes) {
    dishes.forEach((dish, index) => {
      if (!dish.quantity || typeof dish.quantity !== "number") {
        return next({
          status: 400,
          message: `dish ${index} must have a quantity that is an integer greater than 0`,
        });
      }
    });
  }
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

function update(req, res, next) {
  const orderId = Number(req.params.orderId);
  const { foundOrder } = res.locals;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body;

  if (!status) {
    return next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
    });
  } else if (status === "" || status === "invalid") {
    return next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
    });
  } else if (status === "delivered") {
    return next({
      status: 400,
      message: `A delivered order cannot be changed`,
    });
  } else if (Number(id) && Number(id) !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
    });
  }

  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.status = status;
  foundOrder.dishes = dishes;
  res.json({ data: foundOrder });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const { foundOrder } = res.locals;
  const index = orders.findIndex(
    (order) => Number(order.id) === Number(orderId)
  );
  if (foundOrder.status !== "pending") {
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending.`,
    });
  } else {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [isValidOrder, create],
  read: [findOrder, read],
  update: [findOrder, isValidOrder, update],
  delete: [findOrder, destroy],
};
