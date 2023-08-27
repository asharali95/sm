export const findItem = async (modelName, searchTerm, fieldsToSearch) => {
  const model = require(`../../models/${modelName}`).default;
  const searchRegex = new RegExp(`.*${searchTerm}.*`, "i");
  const searchQuery = {
    $or: fieldsToSearch.map((field) => ({
      [field]: { $regex: searchRegex },
    })),
  };
  let results;
  if (modelName === "jobs") {
    results = await model
      .find({ ...searchQuery, draft: false })
      .select("-applicants -company -draft")
      .sort([["createdAt", "asc"]]);
  } else if (modelName === "users") {
    results = await model.find(searchQuery);
  } else {
    results = await model.find(searchQuery);
  }
  return results;
};
