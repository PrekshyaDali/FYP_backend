const Esewa = require("../../model/EsewaSchema");
const crypto = require("crypto");
const axios = require("axios");
const Finance = require("../../model/FinanceSchema");

const paymentEsewa = async (req, res) => {
  const { amount, course, user , enrollment} = req.body;

  try {
    const newEsewa = new Esewa({
      amount,
      course,
      user,
      enrollment
    

    });

    await newEsewa.save();
        const newFinance = new Finance({
          source: "Khalti",
          amount: amount,
          date: new Date(),
          customerName: "Khalti",
          paymentMethod: "Khalti",
          status: "Paid",
        });
        await newFinance.save();
    console.log(newEsewa, "esewa")
    res.status(200).json({ message: "Payment request created", newEsewa });
  } catch (err) {
    // If an error occurs, send an error response
    res.status(500).json({ error: err.message });
  }
};

const getPaymentKhalti = async(req, res)=>{
  const {userId} = req.params;
  try{
    const payment = await Esewa.find({user: {$in : userId}});
    res.status(200).json({message: "Payment fetched successfully", payment}); 
    console.log(payment, "Hardikpayment")

  }catch(error){
    res.status(500).json({error: error.message});
  
  }

}



const esewaController = {
  paymentEsewa,
  getPaymentKhalti,
};

module.exports = esewaController;
