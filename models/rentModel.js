import mongoose from 'mongoose'

const RHBookSchema = new mongoose.Schema({
    bookId:{
      type: mongoose.SchemaTypes.ObjectId,
      ref:"books",
      required: true,
    },
    ownerId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"users",
        required: true,
    },
    ownerName:{
      type:String,
      required: true
    },
    rent:{
      type:Number,
      required: true,
    },
    rentStatus:{
      type:String,
      required: true,
    },
    deliveryStatus:{
        type:String,
        required: true,
    }
});

const RentHistorySchema = new mongoose.Schema({
  issuerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:"users",
    required: true,
  },
  paymentMode:{
    type:String,
    required: true
  },
  trackingID:{
    type:String,
    required: true
  },
  address:{
    type:String,
    required: true
  },
  subTotal:{
    type:Number,
    required: true
  },
  deliveryCharge:{
    type:Number,
    required: true
  },
  totalAmount:{
    type:Number,
    required: true
  },
  rentedOn:{
    type:Date,
    required: true
  },
  returnDate:{
    type:Date,
    required: true
  },
  books: {
    type: [RHBookSchema],
    require: true
  }
},
  { timestamps: true },
);

const RentHistory = mongoose.model('RentHistory', RentHistorySchema);
export default RentHistory