const express = require('express');
const vendorRoutes = express.Router();
const vendorContoller = require('../Controller/VendorController');

vendorRoutes.post("/createvendor", vendorContoller.createVendor);
vendorRoutes.get("/allvendors", vendorContoller.Vendors);

module.exports= vendorRoutes