import Razorpay from "razorpay";
import crypto from "crypto";
import * as dotenv from 'dotenv'
dotenv.config()

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

const checkout = async (req, res, next) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  console.log('order', order)
  res.status(200).json({
    message: "Success",
    data: order,
  });
}

const paymentVerification = async (req, res) => {
  console.log('In Payment verification API')
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    console.log('Payment Completed')
    res.status(200).json({
      message: "success"
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
};



export { checkout, paymentVerification }