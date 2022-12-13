const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const orders = require(path.resolve("src/data/orders-data"));

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res, next) {
  res.json({ data: dishes });
}

function isValidDish(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const { foundDish } = res.locals;
  if (!name || name === "") {
    return next({ status: 400, message: "Dish must include a name" });
  } else if (!description || description === "") {
    return next({ status: 400, message: "Dish must include a description" });
  } else if (!price) {
    return next({ status: 400, message: "Dish must include a price" });
  } else if (price <= 0 || Number.isInteger(price) === false) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  } else if (!image_url || image_url === "") {
    return next({
      status: 400,
      message: "Dish must include a image_url",
    });
  }
  return next();
}

function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function findDish(req, res, next) {
    const { dishId } = req.params;
    let foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.foundDish = foundDish;
        return next();
    }
    next({ status: 404, message: `Dish Id: ${dishId} not found` });
}

function read(req, res, next) {
    const { foundDish } = res.locals;
    res.json({ data: foundDish });
}

function update(req, res, next) {
    // console.log(res.locals)
    const { foundDish } = res.locals;
  const { dishId } = req.params;
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  if (!dishId) {
    return next({ status: 404, message: `Dish does not exist: ${dishId}` });
  } else if (id && id !== dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  foundDish.name = name
  foundDish.description = description
  foundDish.price = price
  foundDish.image_url = image_url
  res.json({data: foundDish})
}

module.exports = {
  list,
  create: [isValidDish, create],
  read: [findDish, read], 
  update: [findDish, isValidDish, update],
};
