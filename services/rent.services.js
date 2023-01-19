import RentHistory from "../models/rentModel"
import mongoose from "mongoose";
import { updateAfterRentService } from "../services/library.services";

const RentDetailsService = (params, callback) => {
  if (params.rentId === undefined) {
    return callback(
      {
        message: "rentId required",
      },
      ""
    );
  }
  const RH = RentHistory.findOne({ "_id":mongoose.Types.ObjectId(params.rentId)}).populate('books.bookId')
  RH.then((response) => {
    if(response != null)
    {
      return callback(null, response);    
    }
    else
    {
      return callback({
        message: "Rent Details not found",
      },
      "");
    }
  })
  .catch((error) => {
    return callback(error);
  });

}
const IssuedHistoryService = (params, callback) => {
  if (params.issuerId === undefined ) {
    return callback(
      {
        message: "issuerId is required",
      },
      ""
    );
  }
  const Lib = RentHistory.find({"issuerId":mongoose.Types.ObjectId(params.issuerId)}).populate('books.bookId')
  Lib.then((response) => {
    if(response != null)
    {
      var rentRecords = [];
      for(var i = 0; i<response.length;i++)
      {     
            for(var j = 0;j<response[i].books.length;j++)
            {
              var rentedOn = response[i].rentedOn.getDate() + "-" +(response[i].rentedOn.getMonth()+1) + '-'+ response[i].rentedOn.getFullYear();
              var returnDate = response[i].returnDate.getDate() + "-" +(response[i].returnDate.getMonth()+1) + '-'+ response[i].returnDate.getFullYear();
              var temp = {
                  "rentId": response[i]._id,
                  "rentedOn":rentedOn,
                  "returnDate":returnDate,
                  "trackingID":response[i].trackingID,
                  "rent":response[i].books[j].rent,
                  "deliveryStatus":response[i].books[j].deliveryStatus,
                  "ownerName":response[i].books[j].ownerName,
                  "bookName":response[i].books[j].bookId.bookName,
                  "author":response[i].books[j].bookId.author,
                  "isbn":response[i].books[j].bookId.isbn,
                  "imageUrl":response[i].books[j].bookId.imageUrl
                }
                rentRecords.push(temp);
            }
      }
      return callback(null, rentRecords);    
    }
    else
    {
      return callback({
        message: "No records found",
      },
      "");
    }
  })
  .catch((error) => {
    return callback(error);
  });
}
const OfferedHistoryService = (params, callback) => {
  if (params.ownerId === undefined) {
    return callback(
      {
        message: "ownerId, isbn required",
      },
      ""
    );
  }
  
  const RH = RentHistory.find({'books':{$elemMatch:{'ownerId' :mongoose.Types.ObjectId(params.ownerId)}}}).populate('books.bookId').populate('issuerId')
  RH.then((response) => {
      if(response != null)
      { 
        var offeredRecords = [];
        for(var i = 0; i<response.length;i++)
        {
              for(var j = 0;j<response[i].books.length;j++)
              {
                if(response[i].books[j].ownerId == params.ownerId)
                {
                  var rentedOn = response[i].rentedOn.getDate() + "-" +(response[i].rentedOn.getMonth()+1) + '-'+ response[i].rentedOn.getFullYear();
                  var returnDate = response[i].returnDate.getDate() + "-" +(response[i].returnDate.getMonth()+1) + '-'+ response[i].returnDate.getFullYear();
                  var temp = {
                    "rentedOn":rentedOn,
                    "returnDate":returnDate,
                    "rentStatus":response[i].books[j].rentStatus,
                    "rent":response[i].books[j].rent,
                    "rentedBy":response[i].issuerId.firstName +" " + (response[i].issuerId.lastName? response[i].issuerId.lastName:""),
                    "bookName":response[i].books[j].bookId.bookName,
                    "author":response[i].books[j].bookId.author,
                    "isbn":response[i].books[j].bookId.isbn,
                    "imageUrl":response[i].books[j].bookId.imageUrl
                  }
                  offeredRecords.push(temp);
                }
              }
        }
        return callback(null, offeredRecords);    
      }
      else
      {
        return callback({
          message: "No records found",
        },
        "");
      }
    })
    .catch((error) => {
      return callback(error);
    });
   
}
const addHistoryService = (params, callback) => {
  if (params.bookArray === undefined  || params.issuerId === undefined ||
    params.paymentMode === undefined || params.trackingID === undefined || params.address === undefined || params.subTotal === undefined || params.deliveryCharge === undefined ||
    params.totalAmount === undefined || params.rentedOn === undefined || params.returnDate === undefined || 
    params.razorpayOrderId === undefined || params.razorpayPaymentId === undefined) {
    return callback(
      {
        message: "Please enter Mandatory Details required",
      },
      ""
    );
  }

  const RH = new RentHistory({
    "issuerId":params.issuerId,
    "paymentMode":params.paymentMode,
    "trackingID":params.trackingID,
    "address":params.address,
    "subTotal":params.subTotal,
    "deliveryCharge":params.deliveryCharge,
    "totalAmount":params.totalAmount,
    "rentedOn":params.rentedOn,
    "returnDate":params.returnDate,
    "books": params.bookArray,
    "razorpayOrderId": params.razorpayOrderId,
    "razorpayPaymentId": params.razorpayPaymentId
  });
  RH
    .save()
    .then((docs) => {
       
      updateAfterRentService(params.bookArray, (error, response) => {
        if (error) {
          return callback(error,"");
        }
        return callback(null, docs);
      })
    })
    .catch((error) => {
      return callback(error);
    });
}

export { RentDetailsService, IssuedHistoryService, OfferedHistoryService, addHistoryService }