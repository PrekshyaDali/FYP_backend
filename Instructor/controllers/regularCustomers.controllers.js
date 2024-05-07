const RegularCustomers = require("../../model/RegularCustomer.Schema");
const Finance = require("../../model/FinanceSchema");
const regularCustomerTracking = async (req, res) => {
  try {
    const { amount, duration, category, customerName } = req.body;
    const newRegularCustomer = new RegularCustomers({
      amount,
      duration,
      category,
      customerName,
    });

    await newRegularCustomer.save();
    const newFinance = new Finance({
      source: "Regular Customer",
      amount: amount,
      date: new Date(),
      customerName: customerName,
      paymentMethod: "In House",
      status: "Paid",
    });
    await newFinance.save();
    res
      .status(200)
      .json({ success: true, message: "Regular customer added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRegularCustomer = async (req, res) => {
  try {
    // Get the current date and set it to the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    // Create the end of the day
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    // Fetch records with a date within the boundaries
    const regularCustomer = await RegularCustomers.find({
      date: { $gte: today, $lte: endOfDay },
    });

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
