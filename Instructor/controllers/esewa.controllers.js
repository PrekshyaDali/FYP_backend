const Esewa = require("../../model/EsewaSchema");
const crypto = require("crypto");
const axios = require("axios");

const paymentEsewa = async (req, res) => {
  const { amount, course, user } = req.body;

  try {
    const newEsewa = new Esewa({
      amount,
      course,
      user,

    });

    await newEsewa.save();
    res.status(200).json({ message: "Payment request created", newEsewa });
  } catch (err) {
    // If an error occurs, send an error response
    res.status(500).json({ error: err.message });
  }
};

const getPaymentKhalti = async(req, res)=>{
  const {userId} = req.params;
  try{
    const payment = await Esewa.find({user: userId});
    res.status(200).json({message: "Payment fetched successfully", payment}); 
  }catch(error){
    res.status(500).json({error: error.message});
  
  }

}



const esewaController = {
  paymentEsewa,
  getPaymentKhalti,
};

module.exports = esewaController;
