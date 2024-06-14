const ServiceModel = require("../Models/ServiceModel");
const userModel = require("../Models/users");
const CustomerModel = require("../Models/CustomerModel")
const mongoose = require('mongoose');
const CreateService = async (req, res) => {
    const { vendor, name, description, price } = req.body;
  try {
    const IsVendor = await userModel.findById({_id:vendor});
  
    if (!IsVendor)
      return res
        .status(200)
        .json({ msg: "Vendor is not valid or not available" });
    if(IsVendor.role == "user" || IsVendor.role == "Admin"){
        return res.status(201).json({msg:"only vendor can create the services"})
    }
    const service = await ServiceModel.create({
      vendor,
      name,
      description,
      price,
    });
    return res.status(201).json({msg:"services created by Vendor",service})
  } catch (error) {
    return res.status(400).json({msg:"Error While creating services",error:error})
  }
};

const ServicesByVendor = async(req,res)=>{
    const {vendorId }= req.params;
    try {
        const result = await ServiceModel.find({ vendor: vendorId });
        return res.json({"Total service":result.length,services:result})
    } catch (error) {
        return res.json({msg:"internal server error",error})
    }
}
const ServiceById = async(req,res)=>{
    const {id }= req.params;
    try {
        const result = await ServiceModel.findById({ _id: id });
        return res.json({msg:result})
    } catch (error) {
        return res.json({msg:"internal server error",error})
    }
}
// const getCustomersByVendor = async (req, res) => {
//     const { vendorId } = req.params;
//     try {
//         // Find all services provided by the vendor
//     const services = await ServiceModel.find({ vendor: vendorId });
//     // Extract service IDs
//     const serviceIds = services.map(service => service._id);
//     console.log(serviceIds)
//     // Find all customers who have availed any of these services
//     const customers = await CustomerModel.find({ availedServices: { $in: serviceIds } });
//     return res.json({ "Total customers": customers.length, customers });
//     } catch (error) {
//         return res.json({msg:"internal server error"})
//     }
// }

const getCustomersByVendor = async (req, res) => {
    const { vendorId } = req.params;
    try {
        // Find all services provided by the vendor
        const services = await ServiceModel.find({ vendor: vendorId });
        
        // Extract service IDs
        const serviceIds = services.map(service => service._id.toString());
        console.log(serviceIds);

        // Find all customers who have availed any of these services
        let customers = await CustomerModel.find({ availedServices: { $in: serviceIds } });

        // Filter availedServices for each customer to include only those from the specified vendor
        customers = customers.map(customer => {
            const filteredServices = customer.availedServices.filter(serviceId =>
                serviceIds.includes(serviceId.toString())
            );
            console.log("filtered Services",filteredServices )
            return {
                ...customer.toObject(),
                availedServices: filteredServices
                
            };
        });

        return res.json({ "Total customers": customers.length, customers });
    } catch (error) {
        console.error(error);
        return res.json({ msg: "internal server error" });
    }
};



// const getCustomersByVendor = async (req, res) => {
//   const { vendorId } = req.params;
//   try {
//     const result = await ServiceModel.aggregate([
//       { $match: { vendor: mongoose.Types.ObjectId(vendorId) } },
//       {
//         $lookup: {
//           from: 'customers',
//           localField: '_id',
//           foreignField: 'availedServices',
//           as: 'customers'
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           uniqueServices: { $addToSet: '$_id' },
//           customers: { $addToSet: '$customers' }
//         }
//       }
//     ]);

//     const uniqueCustomers = result.length > 0 ? result[0].customers.flat() : [];

//     return res.json({
//       "Total customers": uniqueCustomers.length,
//       customers: uniqueCustomers
//     });
//   } catch (error) {
//     console.error(error);
//     return res.json({ msg: "internal server error", error });
//   }
// };



module.exports = {
    CreateService,
    getCustomersByVendor,
    ServicesByVendor,
    ServiceById
  };
