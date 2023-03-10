import bcrypt from "bcryptjs"

import {
  signUpService,
  loginService,
  updateProfilePictureService,
  getUserAccountService,
  getUpdateAccountService,
  addAddressService,
  editAddressService,
  addressListService,
  deleteAddressService,
  addToCartService,
  deleteFromCartService,
  deleteAllFromCartService,
} from "../services/user.services";

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
  const { emailId, userId } = req.user

  updateProfilePictureService({ profilePicture, emailId, userId }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const getUserAccount = async (req, res, next) => {
  const { emailId, userId } = req.user

  getUserAccountService({ emailId, userId }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const updateUserAccount = async (req, res, next) => {
  const { emailId, userId } = req.user
  const {
    firstName,
    lastName,
    phoneNumber,
    gender,
    dob
  } = req?.body

  getUpdateAccountService({ emailId, userId, firstName, lastName, phoneNumber, gender, dob }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const addAddress = async (req, res, next) => {
  const { emailId, userId } = req.user
  const data = { ...req?.body }

  addAddressService({ emailId, userId, data }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const editAddress = async (req, res, next) => {
  const { emailId, userId } = req.user
  const data = { ...req?.body }

  editAddressService({ emailId, userId, data }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const deleteAddress = async (req, res, next) => {
  const { emailId, userId } = req.user
  const data = req?.body

  deleteAddressService({ emailId, userId, data }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const addressesList = async (req, res, next) => {
  const { emailId, userId } = req.user

  addressListService({ emailId, userId }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const addToCart = (req, res, next) => {
  const { emailId, userId } = req.user
  const data = req?.body

  addToCartService({ emailId, userId, data }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}


const deleteFromCart = (req, res, next) => {
  const { emailId, userId } = req.user
  const data = req?.body

  deleteFromCartService({ emailId, userId, data }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

const deleteAllFromCart = (req, res, next) => {
  const { emailId, userId } = req.user

  deleteAllFromCartService({ emailId, userId }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

export {
  signUp,
  login,
  updateProfilePicture,
  getUserAccount,
  updateUserAccount,
  addAddress,
  editAddress,
  deleteAddress,
  addressesList,
  addToCart,
  deleteFromCart,
  deleteAllFromCart
}