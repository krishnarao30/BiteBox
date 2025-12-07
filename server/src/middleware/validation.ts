import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";


const handleValidationErrors = async(req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // 400 -> bad request 
        }
        next();      
};

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("contactNumber").isString().notEmpty().withMessage("Contact Number must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    body("state").isString().notEmpty().withMessage("State must be a string"),
    body("pincode").isString().notEmpty().withMessage("Pincode must be a string"),
    handleValidationErrors,
];



export const validateMyRestaurantRequest = [
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("pincode").notEmpty().withMessage("Pincode is required"),
  body("deliveryPrice").isFloat({ min: 0 }).withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime").isInt({ min: 0 }).withMessage("Estimated delivery time must be a positive number"),
  body("cuisines").isArray().withMessage("Cuisines must be an array").not().isEmpty().withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("phoneNumber").isString().notEmpty().withMessage("Phone Number is required"),
  body("address").isString().notEmpty().withMessage("Address is required"),

  handleValidationErrors,
];