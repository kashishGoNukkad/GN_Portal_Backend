const express = require('express');
const enduserRoutes = express.Router();
const enduserContoller = require('../Controller/EndUserController');

enduserRoutes.post("/createenduser", enduserContoller.createEndUser);
enduserRoutes.get("/allendusers", enduserContoller.EndUser);
enduserRoutes.put('/editenduser/:id', enduserContoller.editEndUser);
enduserRoutes.delete('/deleteenduser/:id', enduserContoller.deleteEndUser);

module.exports= enduserRoutes