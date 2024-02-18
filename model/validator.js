// const {body , validationResult} = require('express-validator');


// const validate = [
//     body('firstname').isLength({min: 3}).withMessage('Name must be at least 3 characters long'),
//     body('lastname').isLength({min: 3}).withMessage('Name must be at least 3 characters long'),
//     body('email').isEmail().withMessage('Invalid email'),
//     body('password').isLength({min: 5}).withMessage('Password must be at least 5 characters long'),
//     body('password').custom((value, {req}) => {
//         if(value !== req.body.confirmPassword) {
//             throw new Error('Passwords do not match');
//         }
//         return true;
//     }),
//     //date of birth
//     body('dob').custom((value, {req}) => {
//         if(value === '') {
//             throw new Error('Date of birth is required');
//         }
//         return true;
//     }),
//     body('dob').custom((value, {req}) => {
//         if(value > new Date().toISOString().split('T')[0]) {
//             throw new Error('Date of birth cannot be in the future');
//         }
//         return true;
//     }
//     ),

//     //contactnumner
//     body('contactnumber').isLength({min: 10}).withMessage('Contact number must be at least 10 characters long'),
//     body('contactnumber').isNumeric().withMessage('Contact number must be numeric'),
//     body("emergencycontactnumber").isLength({min: 10}).withMessage("Emergency contact number must be at least 10 characters long"),
//     body("emergencycontactnumber").isNumeric().withMessage("Emergency contact number must be numeric"),
//     body("address").isLength({min: 5}).withMessage("Address must be at least 5 characters long"),
//     //gender which can only me male female or other
//     body("gender").custom((value, {req}) => {
//         if (value !== male || value !== female || value !== other) {
//             throw new Error
//         }
//         return true;
//     }
//     ),

    

// ]

// const validationMiddleware = (req, res, next) => {
//   // Execute validation chain
//   Promise.all(validate.map((validation) => validation(req))).then(() => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
    
//     next(); // Call the next middleware function
//   });
// };

// module.exports = validationMiddleware;