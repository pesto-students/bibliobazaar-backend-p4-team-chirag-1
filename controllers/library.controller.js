import { addBookService, findBookService, editBookService, removeBookService, bookDetailsService, getCollectionService, searchLibService } from "../services/library.services";

const addBook = (req, res, next) => {
  var  params = {
    userId: req.user.userId,
    bookName: req.body.bookName,
    author: req.body.author,
    isbn: req.body.isbn,
    imageUrl: req.body.imageUrl,
    genre: req.body.genre,
    description: req.body.description,
    language: req.body.language,
    availableBook: req.body.availableBook,
    rentExpected: req.body.rentExpected
    };
    addBookService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}

const findBook = (req, res, next) => {
    var  params = {
      userId: req.user.userId,
      isbn: req.body.isbn
      };
    findBookService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}

const editBook = (req, res, next) => {
  var  params = {
    userId: req.user.userId,
    bookId: req.body.bookId,
    availableBook: req.body.availableBook,
    rentExpected: req.body.rentExpected
    };
  editBookService(params, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const removeBook = (req, res, next) => {
  var  params = {
    userId: req.user.userId,
    bookId: req.body.bookId,
    };
  
    removeBookService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}

const bookDetails = (req, res, next) => {
  var  params = {
    userId: req.user.userId,
    bookId: req.body.bookId,
    };
    bookDetailsService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}

const getCollection = (req, res, next) => {
    const { userId } = req.user;
    getCollectionService({ userId }, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}

const search = (req, res, next) => {
   
    var params = {
      q: req.query.q,
      userId:req.user?.userId,
      lang: req.query.lang?.toLowerCase(),
      genre: req.query.genre?.toLowerCase(),
      startIndex : req.query.startIndex ? req.query.startIndex :0,
      sortBy:req.query.sortBy? req.query.sortBy:"rentExpected",
      order:req.query.order?req.query.order:"asc"
     };
    searchLibService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
}

export { search, findBook, addBook, editBook, removeBook, bookDetails, getCollection }