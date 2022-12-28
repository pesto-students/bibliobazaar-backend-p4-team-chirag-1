import { searchService} from "../services/search.services";
import { GOOGLE_API_KEY } from '../config/config'
const searchBook = (req, res, next) => {
    if (!req.query) {
        return next(new Error('Query is required'));
    }
    var params = {
        q: req.query.book,
        printType:'books',
        key:GOOGLE_API_KEY
    };

   searchService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    });
  }


export { searchBook }