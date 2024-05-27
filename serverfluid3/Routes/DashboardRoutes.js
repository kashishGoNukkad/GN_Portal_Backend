const express = require('express');
const dataRoutes = express.Router();
const Auth = require('../Middleware/authUser')
const dataController = require('../Controller/DashboardController');

dataRoutes.get("/dashboard", Auth, dataController.Dashboard);
dataRoutes.get("/admindashboard/users", Auth, dataController.Dashboard);
// dataRoutes.get("/dashboard",  dataController.Dashboard);

module.exports = dataRoutes