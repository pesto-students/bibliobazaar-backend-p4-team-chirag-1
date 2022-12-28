
import ImageKit from "imagekit";

// SDK initialization

// var imagekit = new ImageKit({
//   publicKey : 'process.env.IMAGEKIT_PUBLIC_KEY',
//   privateKey : 'process.env.IMAGEKIT_PRIVATE_KEY',
//   urlEndpoint : 'process.env.IMAGEKIT_URL'
// });

// Need to check why env is not accessible
var imagekit = new ImageKit({
  publicKey: "public_XG6CXMH60Rb/+2YhrO3ymBG2KnA=",
  privateKey: "private_HXJBqgv/JQ8zBKnPdaDunzRlFD4=",
  urlEndpoint: "https://ik.imagekit.io/biblioBazaar"
});

const uploadService = ({ file, fileName, url }, callback) => {
  if (file === undefined || fileName === undefined) {
    if (url === undefined) {
      return callback(
        {
          message: "File Required",
        },
        ""
      );
    }
  }

  imagekit.upload({
    file: file?.data || url,
    fileName: fileName || url.split('/').pop().toString(),
  }).then(response => {
    // console.log('response', response?.url);
    return callback(null, { url: response?.url })
  }).catch(error => {
    console.log(error);
    return callback({
      message: "Unable to upload image"
    })
  });
}

export { uploadService }