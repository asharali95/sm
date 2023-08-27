import pagesModel from "../../models/pages";

//Get all pages
export const findPages = async (filter) => {
  const foundPages = await pagesModel
    .find(filter)
    .sort([["order", "asc"]])
    .exec();
  return foundPages;
};

//Find job and update

export const findPageAndUpdate = async (filter, update) => {
  const updatedPage = await pagesModel.findOneAndUpdate(filter, update, {
    new: true,
  });
  return updatedPage;
};
