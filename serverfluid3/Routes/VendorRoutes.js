const express = require('express');
const vendorRoutes = express.Router();
const vendorContoller = require('../Controller/VendorController');

vendorRoutes.post("/createvendor", vendorContoller.createVendor);
vendorRoutes.get("/allvendors", vendorContoller.Vendors);
vendorRoutes.put('/editvendor/:id', vendorContoller.editVendor);
vendorRoutes.delete('/deletevendor/:id', vendorContoller.deleteVendor);
vendorRoutes.get('/FindvendorById/:id', vendorContoller.Vendor_By_id);

module.exports= vendorRoutes