const RegularCustomers = require("../../model/RegularCustomer.Schema");

const regularCustomerTracking = async (req, res) => {
  try {
    const { amount, duration, category } = req.body;
    const newRegularCustomer = new RegularCustomers({
      amount,
      duration,
      category,
    });
    await newRegularCustomer.save();
    res
      .status(200)
      .json({ success: true, message: "Regular customer added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRegularCustomer = async (req, res) => {
  try {
    const regularCustomer = await RegularCustomers.find();
    res.status(200).json({ success: true, regularCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const regularCustomersController = {
  regularCustomerTracking,
    getRegularCustomer,
};
module.exports = regularCustomersController;
