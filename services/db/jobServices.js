import jobsModel from "../../models/jobs";

//Get a single Job
export const findJob = async (filter) => {
  const foundJob = await jobsModel.findOne(filter).lean().exec();
  return foundJob;
};

//Get a single Job
export const findJobWithoutLean = async (filter) => {
  const foundJob = await jobsModel.findOne(filter).exec();
  return foundJob;
};

//Create a job
export const createJob = async (jobObject) => {
  const job = jobsModel(jobObject);
  const createdJob = await job.save();
  return createdJob;
};
//Get jobs
export const findJobs = async (filter) => {
  const foundJobs = await jobsModel
    .find(filter)
    .populate({ path: "applicants.user", select: "name email _id" })
    .populate({
      path: `assignment.assignedTo`,
      select: "name email phone social _id designation image",
    })
    .populate({
      path: `transfer.transfarredTo`,
      select: "name  _id designation ",
    })
    .populate({
      path: `assignment.assignedBy`,
      select: "name  _id designation ",
    })
    .populate({
      path: `transfer.transfarredBy`,
      select: "name  _id designation ",
    })
    .populate({
      path: `postedBy`,
      select: "name  _id designation ",
    })
    .populate({
      path: `company`,
      select: `website`,
    })
    .sort([["createdAt", "desc"]])
    .exec();
  return foundJobs;
};
//Get all jobs
export const findAllJobs = async (currentPage, itemsPerPage, isFuture) => {
  if (isFuture) {
    const foundJobs = await jobsModel
      .find({
        draft: false,
        publish: true,
        isFuture: isFuture === "true" ? true : !true,
      })
      .populate({
        path: `assignment.assignedTo`,
        select: "name email phone social _id designation image",
      })
      .select("-applicants -company -draft")
      .sort([["createdAt", "desc"]]);
    const noOfJobs = await jobsModel.countDocuments({
      draft: false,
      publish: true,
      isFuture: isFuture === "true" ? true : !true,
    });
    return { data: foundJobs, noOfData: noOfJobs };
  } else {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const foundJobs = await jobsModel
      .find({
        draft: false,
        publish: true,
      })
      .skip(startIndex)
      .limit(itemsPerPage)
      .populate({
        path: `assignment.assignedTo`,
        select: "name email phone social _id designation image",
      })
      .populate({
        path: `company`,
        select: `website`,
      })
      .select("-applicants  -draft")
      .sort([["createdAt", "desc"]]);
    const noOfJobs = await jobsModel.countDocuments({
      draft: false,
      publish: true,
    });
    console.log({ data: foundJobs, noOfData: noOfJobs });
    return { data: foundJobs, noOfData: noOfJobs };
  }
};
//Find job and update

export const findJobAndUpdate = async (filter, update, option) => {
  const updatedJob = await jobsModel.findOneAndUpdate(filter, update, {
    ...option,
    new: true,
  });
  return updatedJob;
};

//Delete jobs
export const removeJob = async (id) => {
  const deleteJob = await jobsModel.findOneAndDelete(id);
  return deleteJob;
};
