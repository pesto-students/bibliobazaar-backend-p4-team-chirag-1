import Library from "../models/libraryModel"
import { getBookId, FindBookId, SearchBookId } from "../services/book.services";
import mongoose from "mongoose";

const addBookService = (params, callback) => {
  if (params.userId === undefined || params.bookName === undefined || params.author === undefined ||
    params.isbn === undefined || params.quantity === undefined || params.rentExpected === undefined ) {
    return callback(
      {
        message: "userId, bookName, author, isbn, quantity, rentExpected",
      },
      ""
    );
  }
  const { bookName, author, isbn, imageUrl, genre, language,} =  params;
  getBookId({ bookName, author, isbn, imageUrl, genre, language }, (error, bookId) => {
    if (error) {
      return callback(error,"");
    }
  const Lib = Library.findOne({userId:params.userId})
  Lib.then((response) => {
    if(response != null)
    {
        let bookExists = false;
        for (var index = 0; index < response.books.length; ++index) {
          var tempBook = response.books[index];
          if(tempBook.bookId == bookId){
            bookExists = true;
            break;
          }
         }

        if(bookExists)
        {
          return callback(
            {
              message: "Book already present in library",
            },
            ""
          );
        }
        
        Library.updateOne(
          { userId : params.userId }, 
          { $push: { 
              books: {
                "bookId":bookId,
                "availableBook":params.quantity,
                "rentExpected":params.rentExpected
              }
          }
         },
          function (err, docs) {
            if (err){
              return callback(err,"");
            }
            return callback(null, docs);
          }
        );
        
    }
    else
    {
      const Lib2 = new Library({
        "userId":params.userId,
        "books": {
        "bookId":bookId,
        "quantity":params.quantity,
        "availableBook":params.quantity,
        "rentExpected":params.rentExpected
        }
      });
      Lib2
        .save()
        .then((docs) => {
          return callback(null, docs);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  })
  .catch((error) => {
    return callback(error);
  });
  });
}
const findBookService = (params, callback) => {
  if (params.userId === undefined ||  params.isbn === undefined) {
    return callback(
      {
        message: "userId, isbn required",
      },
      ""
    );
  }
  
  const { isbn } =  params;
  FindBookId({ isbn }, (error, bookId) => {
    if (error) { 
      return callback(error,"");
    }

    if(bookId == null)
    {
       return callback(null,{'bookFound':false});
    }
    
    const Lib = Library.find({ 'userId': mongoose.Types.ObjectId(params.userId), books:{$elemMatch:{bookId :mongoose.Types.ObjectId(bookId)}}})
    Lib.then((response) => {
      if(response != null)
      { 
        return callback(null,{'bookFound':true});
      }
      else
      {
        return callback(null,{'bookFound':false});
      }
    })
    .catch((error) => {
      return callback(error);
    });
  });

   
}
const editBookService = (params, callback) => {
  if (params.userId === undefined ||  params.bookId === undefined || params.availableBook === undefined ||  params.rentExpected === undefined) {
    return callback(
      {
        message: "userId, bookId, availableBook,rentExpected required",
      },
      ""
    );
  }

  Library.updateOne(
    { "userId" : params.userId,
      "books.bookId":params.bookId
    }, 
    { 
      $set: { 
          'books.$.rentExpected': params.rentExpected,
          'books.$.availableBook': params.availableBook
      }
    },
    function (err, docs) {
        if (err){
          return callback(err);
        }
        return callback(null, docs);
      }
    );
}
const removeBookService = (params, callback) => {
  if (params.userId === undefined ||  params.bookId === undefined) {
    return callback(
      {
        message: "userId, bookId required",
      },
      ""
    );
  }

      Library.updateOne(
        { 
          "userId" : mongoose.Types.ObjectId(params.userId)
        }, 
        { 
          $pull: { 
            'books': { 'bookId':mongoose.Types.ObjectId(params.bookId) }
        }
       },
        function (err, docs) {
          if (err){
            return callback(err);
          }
          return callback(null, docs);
        }
      );
}
const bookDetailsService = (params, callback) => {
  if (params.userId === undefined ||  params.bookId === undefined) {
    return callback(
      {
        message: "userId, isbn required",
      },
      ""
    );
  }

  const Lib = Library.findOne({ "userId" : params.userId}).populate('books.bookId')
  Lib.then((response) => {
    if(response != null)
    {
      var BookItem = response.books?.filter((item) =>{
         
         return item.bookId._id.toString() == params.bookId
      });
      return callback(null, BookItem);    
    }
    else
    {
      return callback({
        message: "Book not found",
      },
      "");
    }
  })
  .catch((error) => {
    return callback(error);
  });

}
const getCollectionService = (params, callback) => {
  if (params.userId === undefined) {
    return callback(
      {
        message: "userId required",
      },
      ""
    );
  }

  const Lib = Library.find({"userId":params.userId}).populate('books.bookId')
  Lib.then((response) => {
    if(response != null)
    {
      return callback(null, response);    
    }
    else
    {
      return callback({
        message: "Library not found",
      },
      "");
    }
  })
  .catch((error) => {
    return callback(error);
  });

}
const searchLibService = (params, callback) => {
  if (params.q === undefined) {
    return callback(
      {
        message: "Search Key required",
      },
      ""
    );
  }

 
  const { bookName, author, isbn, imageUrl, genre, language,} =  params;
  SearchBookId({ bookName, author, isbn, imageUrl, genre, language }, (error, bookId) => {
    if (error) {
      return callback(error,"");
    }
  });
}

export { addBookService, findBookService, editBookService, removeBookService, bookDetailsService, getCollectionService, searchLibService }