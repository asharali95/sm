import apiHandler from "../../../utils/api-handler";
import { findItem } from "../../../services/db/searchService";

const getSearchItem = async (req, res) => {
  const { searchCollection, searchTerm, searchField } = req.query;
  const foundItem = await findItem(
    searchCollection,
    searchTerm,
    searchField.split(",")
  );

  res.status(200).json({
    foundItem,
  });
};

export default apiHandler({ get: getSearchItem });
