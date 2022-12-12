const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const orders = require(path.resolve("src/data/orders-data"))

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res, next) {
    res.json({ data: dishes });
  }

module.exports = {
    list,
    // create: [hasHref, create],
    // read: [urlExists, read],
    // update: [urlExists, hasHref, update],
    // urlExists,
  };