import { uploadService } from "../services/upload.services";

const upload = (req, res, next) => {
  const file = req?.files?.file
  const fileName = file?.name
  const url = req?.body?.url
  console.log('url', req?.body?.url)
  uploadService({ file, fileName, url }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}


export { upload }