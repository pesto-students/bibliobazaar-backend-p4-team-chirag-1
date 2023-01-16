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
      const userId = response._id.toString()
      const token = generateAccessToken({ emailId: params.emailId, userId })
      // return callback(null, response);
      return callback(null, {
        ...response.toJSON(),
        token,
      });
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
    const userId = user._id.toString()
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken({ emailId, userId });
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
      // return callback(null, { token, userId });
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

const updateProfilePictureService = async ({ profilePicture, emailId, userId }, callback) => {
  if (profilePicture === undefined) {
    return callback(
      {
        message: "Profile Picture url is required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });
  // return callback({}, "")

  if (user != null) {
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { profilePicture },
      { new: true }
    )
    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const getUserAccountService = async ({ emailId, userId }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {
    return callback(null, user);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const getUpdateAccountService = async ({ emailId, userId, firstName, lastName, phoneNumber, gender, dob }, callback) => {
  const user = await users.findOne({ emailId });

  const data = {
    firstName: firstName ? firstName : user?.firstName,
    lastName: lastName ? lastName : user?.lastName,
    phoneNumber: phoneNumber ? phoneNumber : user?.phoneNumber,
    gender: gender ? gender : user?.gender,
    dob: dob ? dob : user?.dob,
  }
  if (user != null) {
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { ...data },
      { new: true }
    )
    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const addAddressService = async ({ emailId, userId, data }, callback) => {
  const user = await users.findOne({ emailId });
  let currentAddresses = user?.addresses ? user.addresses : []
  if (user != null) {
    if (data?.isDefault) {
      currentAddresses.map((address) => address.isDefault = false)
    }
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { addresses: [...currentAddresses, data] },
      { new: true }
    )
    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const editAddressService = async ({ emailId, userId, data }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentAddresses = [...user.addresses]
    let filteredAddresses = currentAddresses.filter(item => item._id.toString() !== data?.addressId);
    delete data?.addressId
    if (data?.isDefault) {
      filteredAddresses.map((address) => address.isDefault = false)
    }
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { addresses: [...filteredAddresses, {...data}] },
      { new: true }
    )

    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const deleteAddressService = async ({ emailId, userId, data }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentAddresses = [...user.addresses]
    let filteredAddresses = currentAddresses.filter(item => item._id.toString() !== data?.addressId);
    const updateUser = await users.findByIdAndUpdate(
      user._id,
      { addresses: filteredAddresses },
      { new: true }
    )

    return callback(null, updateUser);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const addressListService = async ({ emailId, userId }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {
    return callback(null, user.addresses);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const addToCartService = async ({ emailId, userId, data }, callback) => {
  if (data.bookId === undefined || data.ownerId === undefined) {
    return callback(
      {
        message: "bookId, ownerUserId Required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentCartItems = user?.cart.contents ? user.cart.contents : []

    const updateCart = await users.findByIdAndUpdate(
      user._id,
      { cart: { contents: [ ...currentCartItems, data]} },
      { new: true }
    )

    return callback(null, updateCart);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const deleteFromCartService = async ({ emailId, userId, data }, callback) => {
  if (data.id === undefined) {
    return callback(
      {
        message: "id Required",
      },
      ""
    );
  }
  const user = await users.findOne({ emailId });

  if (user != null) {

    let currentCartItems = [...user?.cart.contents]
    let filteredCartItems = currentCartItems.filter(item => item._id.toString() !== data?.id);

    const updateCart = await users.findByIdAndUpdate(
      user._id,
      { cart: { contents: [ ...filteredCartItems ]} },
      { new: true }
    )

    return callback(null, updateCart);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}

const deleteAllFromCartService = async ({ emailId, userId }, callback) => {
  const user = await users.findOne({ emailId });

  if (user != null) {

    const updateCart = await users.findByIdAndUpdate(
      user._id,
      { cart: { contents: [ ]} },
      { new: true }
    )

    return callback(null, updateCart);
  } else {
    return callback({
      message: "Invalid",
    });
  }
}



export {
  signUpService,
  loginService,
  updateProfilePictureService,
  getUserAccountService,
  getUpdateAccountService,
  addAddressService,
  editAddressService,
  deleteAddressService,
  addressListService,
  addToCartService,
  deleteFromCartService,
  deleteAllFromCartService
}