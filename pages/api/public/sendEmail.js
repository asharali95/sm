import apiHandler from "../../../utils/api-handler";
import sendEmail from "../../../utils/sendEmail";

const email = async (req, res) => {
  const { email } = req.query;
  await sendEmail(
    "fergal.oconnor@workeye.ai",
    "Someone reaches Seniormanagers.com",
    undefined,
    undefined,
    `${email} reaches Seniormanagers.com just now.`
  );
  res.status(200).json({
    messsage: "ok",
  });
};

export default apiHandler({ get: email });
