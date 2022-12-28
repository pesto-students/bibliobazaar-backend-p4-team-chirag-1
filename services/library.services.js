import Library from "../models/libraryModel"
import { getBookId } from "../services/book.services";

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
      return next(error);
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
              books: JSON.stringify({
                "bookId":bookId,
                "quantity":params.quantity,
                "availableBook":params.availableBook,
                "rentedBook":params.rentedBook,
                "rentExpected":params.rentExpected
              })
          }
         },
          function (err, docs) {
            if (err){
              return next(err);
            }
            return res.status(200).send({
                message: "Success",
                data: docs,
            });
          }
        );
        
    }
    else
    {
      const Lib2 = new Library(JSON.stringify({
        "userId":params.userId,
        "books": {
        "bookId":bookId,
        "quantity":params.quantity,
        "availableBook":params.availableBook,
        "rentedBook":params.rentedBook,
        "rentExpected":params.rentExpected
        }
      }));
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

const loginService = async ({ emailId, password }, callback) => {
  if (emailId === undefined || password === undefined) {
    return callback(
      {
        message: "Email, Password Required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken(emailId);
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid Username/Password!",
      });
    }
  } else {
    return callback({
      message: "Invalid Username/Password!",
    });
  }
}

export { addBookService, loginService }