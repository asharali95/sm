import Conversation from "../../../../models/conversation"
import apiHandler from "../../../../utils/api-handler";
const getAllConversations = async (req, res) => {
  try {
    let { chatId } = req.query;
    const conversations = await Conversation.find({chatId})  
   if(conversations.length){
    return res.status(200).json({
      message: "successfully retrieve",
      data: conversations,
    });
   }
   return res.status(200).json({
    message: "No chat yet.",
    data: [],
  });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      data: [],
    });
  }
};

export default apiHandler({ get: getAllConversations })
