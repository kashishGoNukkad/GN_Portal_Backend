const express = require('express');
const vendorRoutes = express.Router();
const vendorContoller = require('../Controller/VendorController');

vendorRoutes.post("/createvendor", vendorContoller.createVendor);

module.exports= vendorRoutes