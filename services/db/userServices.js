import userModel from "../../models/users";
export const createUser = async (userObject) => {
  const user = userModel(userObject);
  const createdUser = await user.save();
  return createdUser;
};
// //Get a single user
export const findUser = async (filter) => {
  const foundUser = await userModel
    .findOne(filter)
    .populate({
      path: "company",
      select: "website address companyType phone about companyType",
      model: "Users",
    })
    .lean()
    .exec();
  return foundUser;
};
// //Get a single user to save further change on that record
export const findUserToSave = async (filter) => {
  const foundUser = await userModel.findOne(filter).exec();
  return foundUser;
};
// //Get all users
export const findUsers = async (filter) => {
  const foundUsers = await userModel.find(filter).lean();
  return foundUsers;
};

//Update User
export const findUserAndUpdate = async (id, update) => {
  const updatedUser = await userModel
    .findOneAndUpdate(id, update, {
      new: true,
    })
    .populate({
      path: "company",
      select: "website address companyType phone about companyType",
      model: "Users",
    });
  return updatedUser;
};

export const findInterestAndSavedJobList = async (filter) => {
  const { _id } = filter;
  const foundInterestAndSavedJobList = await userModel
    .find(filter)
    .populate({
      path: "appliedJobs",
      select: "-company -draft ",
      model: "Jobs",
    })
    .populate({
      path: "savedJobs",
      select: "-applicants -company -draft ",
      model: "Jobs",
    })
    .exec();
  return {
    appliedJobs: foundInterestAndSavedJobList[0]?._doc?.appliedJobs?.map(
      (el) => {
        const currentApplicant = el.applicants.filter((el) => el.user == _id);
        return { ...el._doc, applicants: currentApplicant };
      }
    ),
    savedJobs: foundInterestAndSavedJobList[0].savedJobs,
  };
};
