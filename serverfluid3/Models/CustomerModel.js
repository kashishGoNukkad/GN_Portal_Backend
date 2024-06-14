
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
  CustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
//   vendor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Service',
//     required: true
//   },
//   services: [{
//     type: String // Assuming services are just strings, you can change it according to your needs
//   }],
  availedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  collection: 'Subscription',
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
