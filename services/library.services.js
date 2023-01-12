import Library from "../models/libraryModel"
import { getBookId, FindBookId, SearchBookId } from "../services/book.services";
import mongoose from "mongoose";
import { maxResults } from '../config/config'

const addBookService = (params, callback) => {
  if (params.userId === undefined || params.bookName === undefined || params.author === undefined ||
    params.isbn === undefined || params.availableBook === undefined || params.rentExpected === undefined ) {
    return callback(
      {
        message: "userId, bookName, author, isbn, availableBook, rentExpected",
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
                "availableBook":params.availableBook,
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
        "availableBook":params.availableBook,
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
    
    const Lib = Library.find({ 'userId': mongoose.Types.ObjectId(params.userId), 'books':{$elemMatch:{'bookId' :mongoose.Types.ObjectId(bookId)}}})
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
    Lib = Library.find( { "books":{ $elemMatch:{"availableBook" : {$gt:0}}}}).populate('books.bookId');
    Lib.then((response) => {
      
      if(response != null)
      { 
        var BooksItem = [];
        for(var i = 0; i<response.length;i++)
        {
              for(var j = 0;j<response[i].books.length;j++)
              {
                if(response[i].books[j].availableBook > 0 && 
                  ( params.lang === undefined || (params.lang && params.lang == response[i].books[j].bookId.language)) &&
                  ( params.genre === undefined || (params.genre && response[i].books[j].bookId.genre.indexOf(params.genre) > -1 )))
                {
                  var temp = {
                    "userId":response[i].userId,
                    "rentExpected":response[i].books[j].rentExpected,
                    "availableBook":response[i].books[j].availableBook,
                    "createdAt":response[i].books[j].createdAt,
                    "bookId":response[i].books[j].bookId._id,
                    "bookName":response[i].books[j].bookId.bookName,
                    "author":response[i].books[j].bookId.author,
                    "isbn":response[i].books[j].bookId.isbn,
                    "imageUrl":response[i].books[j].bookId?.imageUrl
                  }
                  BooksItem.push(temp);
                }
              }
              if(BooksItem.length == 0)
              {
                return callback({
                  message: "No books found",
                },
                "");
              }
             if(params.order == "desc")
             {
                BooksItem.sort((a,b) => { 
                  if (a[params.sortBy] > b[params.sortBy]) {
                      return -1;
                  }
                  if (a[params.sortBy] < b[params.sortBy]) {
                      return 1;
                  }
                  return 0;
                });
             }
             else
             {
                BooksItem.sort((a,b) => { 
                  if (a[params.sortBy] < b[params.sortBy]) {
                      return -1;
                  }
                  if (a[params.sortBy] > b[params.sortBy]) {
                      return 1;
                  }
                  return 0;
                });
             }
             return callback(null, BooksItem.slice(params.startIndex,params.startIndex+maxResults)); 
          }
      }
      else
      {
        return callback({
          message: "No books found",
        },
        "");
      }
    })
    .catch((error) => {
      return callback(error);
    }); 
  }
  else
  {
    const { q } =  params;
    SearchBookId({ q }, (error, bookIdArray) => {
      if (error) {
        return callback(error,"");
      }
      console.log(bookIdArray);
      const Lib = Library.find({
                          $and:[
                            { "books":{ $elemMatch:{"availableBook" : {$gt:0}}}},
                            { "books":{ $elemMatch:{"bookId" : { $in:  bookIdArray }}}},
                          ]}).populate('books.bookId');
      
                          Lib.then((response) => {
      
                            if(response != null)
                            { 
                              var BooksItem = [];
                              for(var i = 0; i<response.length;i++)
                              {
                                    for(var j = 0;j<response[i].books.length;j++)
                                    {
                                      if( response[i].books[j].availableBook > 0 && 
                                          bookIdArray.some(function (a) {
                                            return a.equals(response[i].books[j].bookId._id);
                                          }) && 
                                        ( params.lang === undefined || (params.lang && params.lang == response[i].books[j].bookId.language)) &&
                                        ( params.genre === undefined || (params.genre && response[i].books[j].bookId.genre.indexOf(params.genre) > -1 )))
                                      {
                                        var temp = {
                                          "userId":response[i].userId,
                                          "rentExpected":response[i].books[j].rentExpected,
                                          "availableBook":response[i].books[j].availableBook,
                                          "createdAt":response[i].books[j].createdAt,
                                          "bookId":response[i].books[j].bookId._id,
                                          "bookName":response[i].books[j].bookId.bookName,
                                          "author":response[i].books[j].bookId.author,
                                          "isbn":response[i].books[j].bookId.isbn,
                                          "imageUrl":response[i].books[j].bookId?.imageUrl
                                        }
                                        BooksItem.push(temp);
                                      }
                                    }
                                    if(BooksItem.length == 0)
                                    {
                                      return callback({
                                        message: "No books found",
                                      },
                                      "");
                                    }
                                   if(params.order == "desc")
                                   {
                                      BooksItem.sort((a,b) => { 
                                        if (a[params.sortBy] > b[params.sortBy]) {
                                            return -1;
                                        }
                                        if (a[params.sortBy] < b[params.sortBy]) {
                                            return 1;
                                        }
                                        return 0;
                                      });
                                   }
                                   else
                                   {
                                      BooksItem.sort((a,b) => { 
                                        if (a[params.sortBy] < b[params.sortBy]) {
                                            return -1;
                                        }
                                        if (a[params.sortBy] > b[params.sortBy]) {
                                            return 1;
                                        }
                                        return 0;
                                      });
                                   }
                                   return callback(null, BooksItem.slice(params.startIndex,params.startIndex+maxResults)); 
                                }
                            }
                            else
                            {
                              return callback({
                                message: "No books found",
                              },
                              "");
                            }
                          })
                          .catch((error) => {
                            return callback(error);
                          }); 
    });
  }

  
}

export { addBookService, findBookService, editBookService, removeBookService, bookDetailsService, getCollectionService, searchLibService }