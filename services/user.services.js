import bcrypt from "bcryptjs";

import { generateAccessToken } from "../middlewares/auth";
import users from "../models/userModel"

const signUpService = (params, callback) => {
  if (params.emailId === undefined || params.password === undefined || params.firstName === undefined) {
    return callback(
      {
        message: "Email, Password, Username Required",
      },
      ""
    );
  }
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

const updateProfilePictureService = async ({ profilePicture, data }, callback) => {
  console.log('uer', data)
  if (profilePicture === undefined) {
    return callback(
      {
        message: "Profile Picture Required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId: data });
  console.log('sdf', user)
  return callback({}, "")

  if (user != null) {
    // const updateUser = await users.findByIdAndUpdate(
    //   ...user,
    //   profilePicture,
    //   { new: true }
    // )
    // return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

export { signUpService, loginService, updateProfilePictureService }