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
    const { issuerId } = req.body;
    IssuedHistoryService({ issuerId }, (error, results) => {
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
    const { ownerId } = req.body;
    OfferedHistoryService({ ownerId }, (error, results) => {
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
  const { bookArray , issuerId,
          paymentMode, trackingID, address, subTotal, deliveryCharge,
          totalAmount, rentedOn, returnDate } = req.body;

  addHistoryService({  bookArray , issuerId,
    paymentMode, trackingID, address, subTotal, deliveryCharge,
    totalAmount, rentedOn, returnDate }, (error, results) => {
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