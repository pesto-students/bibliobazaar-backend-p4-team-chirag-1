import bcrypt from "bcryptjs"

import { signUpService, loginService, updateProfilePictureService } from "../services/user.services";

const signUp = (req, res, next) => {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  signUpService(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

const login = (req, res, next) => {
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

const updateProfilePicture = async (req, res, next) => {
  const { profilePicture } = req.body
  const { data } = req.user

  updateProfilePictureService({ profilePicture, data }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

export { signUp, login, updateProfilePicture }