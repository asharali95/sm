import apiHandler from "../../../../../utils/api-handler";
import { findUsers } from "../../../../../services/db/userServices";
import httpStatusCodes from "../../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";

const getUserData = async (req, res) => {
  const { userType, isCompany, company, id } = req.body;
  if (
    (isCompany === true && userType === "admin") ||
    userType === "admin manager"
  ) {
    const foundUsers = await findUsers({
      $and: [
        {
          $or: [
            {
              company: company,
            },
            { _id: userType === "admin" ? id : company },
          ],
        },
        {
          $or: [
            {
              deleted: undefined,
            },
            { deleted: false },
          ],
        },
      ],
    });

    if (foundUsers) {
      const newusers = foundUsers.map((el) => {
        delete el.password;
        return el;
      });
      const admin = newusers.filter((el) => el.userType === "admin");
      const managers = newusers.filter(
        (el) => el.userType === "manager" || el.userType === "admin manager"
      );

      const executives = newusers.filter((el) => el.userType === "executive");

      let response = {};

      response.admin = admin;

      response.managers = managers.map((el) => {
        if (!el.subOrdinates) {
          el.subOrdinates = [];
        }
        executives.map((el1) => {
          if (el1.manager.toString() === el._id.toString()) {
            el.subOrdinates.push(el1);
          }
        });
        return el;
      });
      res.status(200).json(response);
    } else {
      throw createHttpError(httpStatusCodes.NOT_FOUND, "No Data Found");
    }
  }
  if (userType === "manager") {
    const foundUsers = await findUsers({
      $and: [
        {
          company: company,
        },
        {
          $or: [
            {
              deleted: undefined,
            },
            { deleted: false },
          ],
        },
      ],
    });

    if (foundUsers) {
      const newusers = foundUsers.map((el) => {
        delete el.password;
        return el;
      });
      const executives = newusers.filter(
        (el) => el?.manager?.toString() === id && el.userType === "executive"
      );
      const managers = newusers.filter((el) => el._id.toString() === id);
      const otherManagers = newusers
        .filter(
          ({ userType, _id }) =>
            userType.includes("manager") && _id.toString() !== id
        )
        .map(({ designation, name, _id }) => ({ designation, name, _id }));

      managers[0].subOrdinates = executives;

      const response = { managers, otherManagers };
      res.status(200).json(response);
    } else {
      throw createHttpError(httpStatusCodes.NOT_FOUND, "No Data Found");
    }
  }

  if (userType === "executive") {
    const response = {};
    res.status(200).json(response);
  }
};

export default apiHandler({ post: getUserData });
