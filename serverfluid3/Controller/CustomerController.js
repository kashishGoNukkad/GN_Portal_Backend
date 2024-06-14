const CustomerModel = require("../Models/CustomerModel");

const AvailService = async (req, res) => {
  try {
    const { CustomerId, serviceID } = req.body;
    const Customer = await CustomerModel.findOneAndUpdate(
      { CustomerId: CustomerId },
      { $push: { availedServices: serviceID } },
      { new: true, upsert: true }
    );

    const availedservices = Customer;
    return res
      .status(200)
      .json({
        msg: "services availed by the customer",
        services: availedservices,
      });
  } catch (error) {
    return res.status(201).json({ msg: "internal server erro", error });
  }
};
module.exports = {
  AvailService,
};
