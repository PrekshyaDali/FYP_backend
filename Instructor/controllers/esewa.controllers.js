const Esewa = require("../../model/EsewaSchema")

const paymentEsewa = async(req, res)=>{
    const{amount, course, user} = req.body;
    console.log(amount);
    console.log(course);
    console.log(user)
    try{
        const newEsewa = new Esewa({
            amount,
            course,
            user,
         
        });

        await newEsewa.save();
        res.json({message: "Payment successful"},);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

const esewaControllers = {
    paymentEsewa,
}

module.exports = esewaControllers;