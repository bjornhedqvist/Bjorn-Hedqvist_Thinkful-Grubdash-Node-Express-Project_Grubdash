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

function isValid(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

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
    const { data: { name, description, price, image_url } = {} } = req.body
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

module.exports = {
  list,
  create: [isValid, create],
  // read: [urlExists, read],
  // update: [urlExists, hasHref, update],
  // urlExists,
};
