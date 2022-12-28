import books from "../models/bookModel"

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
  book.then((response) => {
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

      const book2 = new books(params);
      book
        .save()
        .then((response) => {
          return callback(null, response.bookId);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  })
  .catch((error) => {
    return callback(error);
  });
}

export { getBookId }