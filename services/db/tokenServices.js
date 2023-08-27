import tokenModel from "../../models/token";
export const createToken = async (tokenObject) => {
  const token = tokenModel(tokenObject);
  const createdToken = await token.save();
  return createdToken;
};

export const removeToken = async (id) => {
  const deletedToken = await tokenModel.findOneAndDelete(id);
  return deletedToken;
};

export const findToken = async (filter) => {
  const foundToken = await tokenModel.findOne(filter).lean().exec();
  return foundToken;
};
