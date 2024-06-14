const express = require('express');
const CustomerRoutes = express.Router();
const CustomerController = require("../Controller/CustomerController")

CustomerRoutes.post("/api/Customer/availService",CustomerController.AvailService)
// CustomerRoutes.post("/api/AllCustomer/availService",CustomerController.getCustomersByVendor)

module.exports = CustomerRoutes