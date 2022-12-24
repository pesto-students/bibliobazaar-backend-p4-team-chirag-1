import bcrypt from "bcryptjs"

import { signUpService } from "../services/user.services";

const signUp = (req, res, next) => {
  const { password } = req.body;
  console.log('req', req?.body)
  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  signUpService(req.body, (error, results) => {
    console.log('error1', error);
    if (error) {
      console.log('error2', error);
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

export { signUp }