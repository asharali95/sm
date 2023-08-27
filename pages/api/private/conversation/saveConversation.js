import Conversation from "../../../../models/conversation"
import apiHandler from "../../../../utils/api-handler";

const saveConversation = async(req, res) => {
  try {
    const { chatId, senderId, message, attachment, replyId } = req.body;
    const newMessage = new Conversation({
        chatId,
        senderId,
        message,
        attachment,
        replyId,
      });
      await newMessage.save();
      return res.status(200).json({
        message: "added",
        data: newMessage,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
    });
  }
};
export default apiHandler({ post: saveConversation })