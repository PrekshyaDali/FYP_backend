const {Router} = require('express')
const User = require('../model/userSchema')

const userRouter = Router()

userRouter.post('/register',(req,res)=>{
    if(!req.body.username || !req.body.password){
        return  res.json({
            message: "Username and password are both required"
        })
    }

        try {
            console.log(req.body)
            const userCreated = User.create({
                userName: req.body.username,
                password: req.body.password
            })

            return res.status(201).json({
                message: "Registered Successfully",
                data: userCreated
            })

        } catch (error) {
            res.status(400).json({
                error: error
            })
            
        }
    }
)

userRouter.post('/login',async(req,res)=>{
    if(!req.body.username || !req.body.password){
        return res.json({
           message: "Username and password are both required"
       })
   }
   try {
    const user = await User.findOne({userName: req.body.username})
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }
    console.log(user)

    const passwordCompare = user.password === req.body.password ? true : false
    console.log(user.password, req.body.password)
    console.log(passwordCompare)
    if(passwordCompare){
        return res.status(200).json({
            message:"User logged in successfully"
        })
    }
    else{
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

   } catch (error) {
    return res.status(401).json({
        message:"Invalid Credentials"
    })
   }
})






module.exports = userRouter;