const express = require('express');
const searchRoutes = express.Router();
const searchController = require('../Controller/SearchController');

searchRoutes.post("/search", searchController);

module.exports= searchRoutes