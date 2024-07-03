const express = require('express');
const searchRoutes = express.Router();
const searchController = require('../Controller/SearchController');

searchRoutes.post("/search", searchController.Search);
searchRoutes.get("/getservice", searchController.GetService);

module.exports= searchRoutes