import users from "../models/userModel"

const signUpService = (params, callback) => {
  console.log('SignUpService')
  if (params.emailId === undefined) {
    console.log(params.emailId);
    return callback(
      {
        message: "Email Required",
      },
      ""
    );
  }
  console.log('params', params)
  const user = new users(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

export { signUpService }