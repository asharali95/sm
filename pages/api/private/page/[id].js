import apiHandler from "../../../../utils/api-handler";
import {
  findPageAndUpdate,
  findPages,
} from "../../../../services/db/pageService";

const editPage = async (req, res) => {
  const data = req.body;
  const { id } = req.query;
  const updatedPage = await findPageAndUpdate({ _id: id }, data);
  res.status(200).json({
    updatedPage,
  });
};

const getPage = async (req, res) => {
  const { id } = req.query;

  const updatedPage = await findPages({ title: id });
  res.status(200).json({
    updatedPage,
  });
};

export default apiHandler({ put: editPage, get: getPage });
