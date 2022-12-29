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
      
      uploadService(JSON.stringify({ "fileName":params.isbn, "url": params.imageUrl}), (error, results) => {
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
  })
  .catch((error) => {
    return callback(error);
  });
}

export { getBookId }