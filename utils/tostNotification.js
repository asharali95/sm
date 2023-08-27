import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (msg, status, position) =>
  toast[status](msg, { position: position || "top-right" });

export default notify;
