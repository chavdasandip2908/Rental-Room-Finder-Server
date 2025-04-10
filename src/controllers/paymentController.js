const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment")
const User = require("../models/User");
const Property = require("../models/Property");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});


exports.property = async (req, res) => {
    try {
        if (!req.body.amount || isNaN(req.body.amount)) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (req.body.amount > 500000) { // 50,00,000 paise = ₹5,00,000
            return res.status(400).json({ message: "Amount exceeds maximum limit of ₹5,00,000" });
        }

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };



        const user = await User.findById(req.user.id).select("name email"); // User ka data fetch karna
        const order = await instance.orders.create(options);
        console.log(order);

        res.status(200).json({
            data: {
                ...order,
                key: process.env.RAZORPAY_KEY_ID,

            },
            user: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};


exports.verify = async (req, res) => {

    try {
        const { razorpay_orderID, razorpay_paymentID, razorpay_signature, propertyId } = req.body;
        const sign = razorpay_orderID + "|" + razorpay_paymentID;
        const resultSign = crypto
            .createHmac("sha256", RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");
        console.log(razorpay_signature)
        console.log(resultSign)

        if (razorpay_signature === resultSign) {
            const payment = new Payment({
                payment_id: razorpay_paymentID,
                property_id: propertyId,
                payment_date: new Date(),
                payment_method: "Razorpay",
                payment_status: "Completed",
                total_payment: req.body.payment,
                transaction_Type: "credit"
            });

            // update property status to "Sold"
            const property = await Property.findByIdAndUpdate(propertyId, { status: "Sold" }, { new: true });


            const savedPayment = await payment.save();

            return res.status(200).json({ payment: savedPayment });
        } else {
            return res.status(400).json({ message: "Invalid signature" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
