import apiHandler from "../../../../utils/api-handler";
import Chat from "../../../../models/chat";
const updateChat = async (req, res) => {
  const { chatId, allowed } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // Update the "allowed" field
  chat.allowed = allowed;
  await chat.save();

  // Save the new chat to the database
  return res.status(201).json({
    message: "chat updated successfully",
    data: chat.toObject(),
  });
};

export default apiHandler({ put: updateChat })
