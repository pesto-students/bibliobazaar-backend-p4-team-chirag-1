import { addBookService, loginService } from "../services/library.services";

const addBook = (req, res, next) => {
    const { userId, bookName, author, isbn, imageUrl, genre, language, quantity, rentExpected} = req.body;
    addBookService({ userId, bookName, author, isbn, imageUrl, genre, language, quantity, rentExpected }, (error, results) => {
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
  const { emailId, password } = req.body;

  loginService({ emailId, password }, (error, results) => {
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
    const { emailId, password } = req.body;
  
    loginService({ emailId, password }, (error, results) => {
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
    const { emailId, password } = req.body;
  
    loginService({ emailId, password }, (error, results) => {
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
    const { emailId, password } = req.body;
  
    loginService({ emailId, password }, (error, results) => {
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
    const { emailId, password } = req.body;
  
    loginService({ emailId, password }, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
  }

export { search, addBook, editBook, removeBook, bookDetails, getCollection }