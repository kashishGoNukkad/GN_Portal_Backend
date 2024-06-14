const express = require('express');
const ServiceRoutes = express.Router();
const ServiceContoller = require("../Controller/ServiceController")
ServiceRoutes.post("/create/service/api",ServiceContoller.CreateService)
ServiceRoutes.get("/Customers/services/api/:vendorId",ServiceContoller.getCustomersByVendor )
ServiceRoutes.get("/find/service/api/:vendorId",ServiceContoller.ServicesByVendor )
ServiceRoutes.get("/find/service/byID/api/:id",ServiceContoller.ServiceById )
module.exports = ServiceRoutes