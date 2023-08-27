import apiHandler from "../../../../utils/api-handler";
import Chat from "../../../../models/chat";
const createChat = async (req, res) => {
  const { employeeId, employerId, jobId, allowed } = req.body;
  const existingChat = await Chat.findOne({
    employeeId,
    employerId,
    jobId,
  });
  if (existingChat) {
    return res.status(200).json({
      message: "already exists, returning the current chat",
      data: existingChat.toObject(),
    });
  }
  const newChat = new Chat({ employeeId, employerId, jobId, allowed });
  // Save the new chat to the database
  await newChat.save();
  return res.status(201).json({
    message: "chat created successfully",
    data: newChat.toObject(),
  });
};

export default apiHandler({ post: createChat })
