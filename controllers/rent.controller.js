import { RentDetailsService, IssuedHistoryService, OfferedHistoryService, addHistoryService } from "../services/rent.services";

const getRentDetails = (req, res, next) => {
  const { rentId } = req.body;
  RentDetailsService({ rentId }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}
const getIssuedHistory = (req, res, next) => {
    var params = {
      issuerId:req.user?.userId
    }
    IssuedHistoryService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}
const getOfferedHistory = (req, res, next) => {
    var params = {
      ownerId:req.user?.userId
    }
    OfferedHistoryService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}
const addHistory = (req, res, next) => {
   var params = {
    issuerId: req.user.userId,
    bookArray: req.body.bookArray,
    paymentMode: req.body.paymentMode,
    trackingID: req.body.trackingID,
    address: req.body.address,
    subTotal: req.body.subTotal,
    deliveryCharge: req.body.deliveryCharge,
    totalAmount: req.body.totalAmount,
    rentedOn: req.body.rentedOn,
    returnDate: req.body.returnDate,
    razorpayOrderId: req.body.razorpayOrderId,
    razorpayPaymentId: req.body.razorpayPaymentId
  }
  addHistoryService(params, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}


export { getRentDetails, getIssuedHistory, getOfferedHistory, addHistory }