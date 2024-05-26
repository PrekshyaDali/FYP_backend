const Finance = require("../../model/FinanceSchema");
const PDFDocument = require("pdfkit");

const getFinanceData = async (req, res) => {
  try {
    const finance = await Finance.find();
    res.status(200).json({ success: true, finance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFilteredFinances = async (req, res) => {
  try {
    const { filterType, startDate, endDate, paymentMethod } = req.query;

    let dateFilter = {};

    // Construct date filter based on filterType
    switch (filterType) {
      case "thisWeek":
        const today = new Date();
        const startOfWeek = new Date(today);
        const endOfWeek = new Date(today);

        startOfWeek.setDate(today.getDate() - today.getDay()); // Set start of the week to Sunday
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set end of the week to Saturday

        startOfWeek.setHours(0, 0, 0, 0); // Start of the day
        endOfWeek.setHours(23, 59, 59, 999); // End of the day

        dateFilter = { date: { $gte: startOfWeek, $lte: endOfWeek } };
        break;

      case "thisMonth":
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(
          new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1) - 1
        );
        endOfMonth.setHours(23, 59, 59, 999);

        dateFilter = { date: { $gte: startOfMonth, $lte: endOfMonth } };
        break;

      case "twoMonths":
        const startOfTwoMonthsAgo = new Date();
        startOfTwoMonthsAgo.setMonth(startOfTwoMonthsAgo.getMonth() - 2);
        startOfTwoMonthsAgo.setDate(1);
        startOfTwoMonthsAgo.setHours(0, 0, 0, 0);

        const endOfTwoMonthsAgo = new Date(
          startOfTwoMonthsAgo.getFullYear(),
          startOfTwoMonthsAgo.getMonth() + 2,
          0
        );
        endOfTwoMonthsAgo.setHours(23, 59, 59, 999);

        dateFilter = {
          date: { $gte: startOfTwoMonthsAgo, $lte: endOfTwoMonthsAgo },
        };
        break;

      case "threeMonths":
        const startOfThreeMonthsAgo = new Date();
        startOfThreeMonthsAgo.setMonth(startOfThreeMonthsAgo.getMonth() - 3);
        startOfThreeMonthsAgo.setDate(1);
        startOfThreeMonthsAgo.setHours(0, 0, 0, 0);

        const endOfThreeMonthsAgo = new Date(
          startOfThreeMonthsAgo.getFullYear(),
          startOfThreeMonthsAgo.getMonth() + 3,
          0
        );
        endOfThreeMonthsAgo.setHours(23, 59, 59, 999);

        dateFilter = {
          date: { $gte: startOfThreeMonthsAgo, $lte: endOfThreeMonthsAgo },
        };
        break;

      case "custom":
        // Use custom startDate and endDate
        dateFilter = {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        };
        break;

      case "all":
      default:
        break;
    }

    let paymentMethodFilter = {};
    // Construct payment method filter
    if (paymentMethod !== "all") {
      paymentMethodFilter = { paymentMethod };
    }

    const filters = { ...dateFilter, ...paymentMethodFilter };
    console.log(filters, "filters");

    // Fetch finance data based on the constructed filters
    const filteredData = await Finance.find(filters);

    res.status(200).json({ success: true, filteredData });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ success: false, message: error.message });
  }
};

const financeController = {
  getFinanceData,
  getFilteredFinances,
};

module.exports = financeController;
