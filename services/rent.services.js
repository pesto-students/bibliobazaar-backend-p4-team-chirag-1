import RentHistory from "../models/rentModel"
import mongoose from "mongoose";

const RentDetailsService = (params, callback) => {
  if (params.rentId === undefined) {
    return callback(
      {
        message: "rentId required",
      },
      ""
    );
  }

  const RH = RentHistory.findById(params.rentId).populate('books.bookId').populate('books.ownerId')
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
  const Lib = RentHistory.find({"issuerId":params.userId}).populate('books.bookId').populate('books.ownerId')
  Lib.then((response) => {
    if(response != null)
    {
      var rentRecords = [];
      for(var i = 0; i<response.length;i++)
      {
            for(var j = 0;j<response[i].books.length;i++)
            {
                var temp = {
                  "rentedOn":response[i].rentedOn,
                  "returnDate":response[i].returnDate,
                  "trackingID":response[i].trackingID,
                  "deliveryStatus":response[i].books[j].deliveryStatus,
                  "OwnerName":response[i].books[j].ownerId.firstName + response[i].books[j].ownerId?.lastName,
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
              for(var j = 0;j<response[i].books.length;i++)
              {
                  var temp = {
                    "rentedOn":response[i].rentedOn,
                    "returnDate":response[i].returnDate,
                    "rentStatus":response[i].books[j].rentStatus,
                    "rent":response[i].books[j].rent,
                    "rentedBy":response[i].issuerId.firstName + response[i].issuerId?.lastName,
                    "bookName":response[i].books[j].bookId.bookName,
                    "author":response[i].books[j].bookId.author,
                    "isbn":response[i].books[j].bookId.isbn,
                    "imageUrl":response[i].books[j].bookId.imageUrl
                  }
                  offeredRecords.push(temp);
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
    params.totalAmount === undefined || params.rentedOn === undefined || params.returnDate ) {
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
    "books": params.bookArray
  });
  RH
    .save()
    .then((docs) => {
      return callback(null, docs);
    })
    .catch((error) => {
      return callback(error);
    });
}

export { RentDetailsService, IssuedHistoryService, OfferedHistoryService, addHistoryService }