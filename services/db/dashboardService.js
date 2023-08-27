import jobsModel from "../../models/jobs";
import userModel from "../../models/users";

const dashBoardData = async (filter) => {
  const foundJobs = await jobsModel.find();
  return foundJobs;
};
