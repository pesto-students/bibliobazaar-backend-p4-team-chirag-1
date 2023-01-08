import { searchService} from "../services/search.services";
import { GOOGLE_API_KEY } from '../config/config'
import ISO6391 from 'iso-639-1';
const searchBook = (req, res, next) => {
    if (!req.query) {
        return next(new Error('Query is required'));
    }
    var params = {
        q: req.query.q,
        printType:'books',
        maxResults:40,
        key:GOOGLE_API_KEY
    };
   
    if(req.query.startIndex)
     params.startIndex = req.query.startIndex
   else
     params.startIndex = 0
    
   searchService(params, (error, results) => {
      if (error) {
        return next(error);
      }
      
      var bookItem = results.items;
      var bookResults = [];
      for(var i = 0;i<bookItem.length;i++)
      {
          try
          {
            var temp = {
              'bookName':bookItem[i].volumeInfo.title,
              'author':bookItem[i].volumeInfo.authors,
              'description':bookItem[i].volumeInfo.description,
              'isbn':(bookItem[i].volumeInfo.industryIdentifiers.filter(item => item.type === "ISBN_13"))[0].identifier,
              'imageUrl':bookItem[i].volumeInfo?.imageLinks?.thumbnail,
              'genre':bookItem[i].volumeInfo.categories,
              'language':ISO6391.getName(bookItem[i].volumeInfo.language)
            }
            if(temp.bookName && temp.author && temp.isbn)
              bookResults.push(temp);
         }
         catch(err)
         {
            //to use sentry over here
         }
      }

      return res.status(200).send({
        message: "Success",
        data: bookResults,
      });
    });
  }


export { searchBook }