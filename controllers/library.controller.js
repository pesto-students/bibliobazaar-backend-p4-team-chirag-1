import { addBookService, findBookService, editBookService, removeBookService, bookDetailsService, getCollectionService, searchLibService } from "../services/library.services";

const addBook = (req, res, next) => {
    const { userId, bookName, author, isbn, imageUrl, genre, language, availableBook, rentExpected} = req.body;
    addBookService({ userId, bookName, author, isbn, imageUrl, genre, language, availableBook, rentExpected }, (error, results) => {
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
    const { userId, isbn} = req.body;
    findBookService({ userId, isbn }, (error, results) => {
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
  const { userId, bookId, availableBook, rentExpected } = req.body;

  editBookService({ userId, bookId, availableBook, rentExpected }, (error, results) => {
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
    const { userId, bookId } = req.body;
  
    removeBookService({ userId, bookId }, (error, results) => {
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
  const { userId, bookId } = req.body;
  
    bookDetailsService({ userId, bookId }, (error, results) => {
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
    const { userId } = req.body;
  
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
      userId:req.body.userId,
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