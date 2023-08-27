import apiHandler from "../../../../utils/api-handler";
import Chat from "../../../../models/chat";
import User from "../../../../models/users"
const getAllChat = async (req, res) => {
  try {
    let { id, role } = req.query;
    if (role) {
      if (id && role === "employee") {
        // const employeeData = await User.findOne({_id:id})
        const chats = await Chat.find({ employeeId: id, allowed: true }).populate(
          "employerId"
        );
        return res.status(200).json({
          message: "Chats retrieved successfully",
          data: chats,
        });
      }
      if (id && role === "employer") {
        const chats = await Chat.find({ employerId: id }).populate(
          "employeeId"
        );
        return res.status(200).json({
          message: "Chats retrieved successfully",
          data: chats,
        });
      } else {
        return res.status(404).json({
          message: "No chats found",
          data: [],
        });
      }
    }
   return res.status(400).json({
     message: "role is required",
     data: [],
   });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      data: [],
    });
  }
};

export default apiHandler({ get: getAllChat });
