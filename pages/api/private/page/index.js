import apiHandler from "../../../../utils/api-handler";
import { findPages } from "../../../../services/db/pageService";

const editPage = async (req, res) => {
  const foundPages = await findPages({});
  res.status(200).json({
    foundPages,
  });
};

export default apiHandler({ get: editPage });
