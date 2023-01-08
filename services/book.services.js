import books from "../models/bookModel"
import { uploadService } from "../services/upload.services"

const getBookId = (params, callback) => {
  if (params.isbn === undefined)
  {
    return callback(
      {
        message: "ISBN Required",
      },
      ""
    );
  }

  const book1 = books.findOne({isbn:params.isbn})
  book1.then((response) => {
    if(response != null)
    {
      
        return callback(null, response.bookId);
    }
    else
    {
      if (params.bookName === undefined || params.author === undefined || params.isbn === undefined)
      {
        return callback(
          {
            message: "Book details required",
          },
          ""
        );
      }
      if(!params.imageUrl)
      {
        const book2 = new books(params);
        book2
          .save()
          .then((response) => {
            return callback(null, response.bookId);
          })
          .catch((error) => {
            return callback(error);
          });
      }
      else
      {
        uploadService({ "fileName":params.isbn, "url": params.imageUrl}, (error, results) => {
        if (error) {
          return callback(error);
        }
        params.imageUrl = results.url
        const book2 = new books(params);
        book2
          .save()
          .then((response) => {
            return callback(null, response.bookId);
          })
          .catch((error) => {
            return callback(error);
          });
      });
    }
      
    }
  })
  .catch((error) => {
    return callback(error);
  });
}

const FindBookId = (params, callback) => {
  if (params.isbn === undefined)
  {
    return callback(
      {
        message: "ISBN Required",
      },
      ""
    );
  }
  const book1 = books.findOne({isbn:params.isbn})
  book1.then((response) => {
    if(response != null)
      return callback(null, response.bookId);
    else
      return callback(null,null)
  }) 
  .catch((error) => {
    return callback(error);
  });

}

const SearchBookId = (params, callback) => {
  if (params.q === undefined)
  {
    return callback(
      {
        message: "Book details is required for search",
      },
      ""
    );
  }
  const book1 = books.find({"$or":[{"bookName" : {"$regex" : params.q, "$options":"i" }},
                                  {"author" : {"$regex" : params.q, "$options":"i"  }},
                                  {"isbn" : {"$regex" : params.q, "$options":"i" }}]})
  book1.then((response) => {
    if(response != null)
    {
      var bookIdArray = []
      for(var i = 0;i<response.length;i++)
      { 
        bookIdArray.push(response[i]._id);
      }
      return callback(null, bookIdArray);
    }
    else
      return callback(null,null)
  }) 
  .catch((error) => {
    return callback(error);
  });

}
export { getBookId, FindBookId, SearchBookId }