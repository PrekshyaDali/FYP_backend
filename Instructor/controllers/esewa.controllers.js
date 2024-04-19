const Esewa = require("../../model/EsewaSchema");
const crypto = require("crypto");
const axios = require("axios");

const paymentEsewa = async (req, res) => {
  const { amount, course, user } = req.body;

  try {
    // Create a new Esewa instance with the provided data
    const signature = createSignature(
      `total_amount=${amount},transaction_uuid=${course},product_code=EPAYTEST`
    );

    const newEsewa = new Esewa({
      amount,
      course,
      user,
      transaction_uuid: course,
    });
    console.log(newEsewa);
    const esewaResponse = await postToEsewa({
      amount,
      transaction_uuid: course,
      signature,
    });
    console.log(esewaResponse);
    await newEsewa.save();
  } catch (err) {
    // If an error occurs, send an error response
    res.json({ message: err.message });
  }
};

const postToEsewa = async ({ amount, transaction_uuid, signature }) => {
  try {
    const formData = {
      amount: amount,
      failure_url: "http://localhost:3000/user/esewa_payment_failed",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "amount,transaction_uuid,product_code",
      success_url: "http://localhost:3000/user/esewa_payment_success",
      total_amount: amount,
      transaction_uuid: transaction_uuid,
    };
    const res = await axios.post(
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      formData
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

const createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

const esewaController = {
  paymentEsewa,
  createSignature,
};

module.exports = esewaController;
