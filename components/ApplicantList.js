import { EnvelopeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import "animate.css";
import axios from "axios";
import Link from "next/link";
// import Chat from "../pages/api/private/chat"
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function ApplicanList({ open, setOpen, applicantList, jobId }) {
  const router = useRouter()
  const [userId, setUserId] = useState(null);
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user) {
      console.log(session);
      setUserId(session.id);
    }
  }, [session]);
  const handleCreateChatApi = async (employeeId) => {
    let data = { employeeId, employerId: userId, jobId, allowed: true };
    console.log(data);
    try {
      let res = await axios.post(`/api/private/chat/createChat`, data);
      if(res.data && res.data.data){
         router.push(`/inbox?conversationId=${res.data.data._id}`);
      }
    } catch (error) {}
  };
  return (
    <div
      style={{ height: "100%" }}
      className=" bg-gray-700/30  z-50 fixed inset-0 flex justify-center items-center  h-full"
    >
      {userId && (
        <div
          className="relative px-3 flex flex-col  items-center  bg-gray-50 w-[90%] md:w-1/3 py-10  rounded-lg max-h-[90%]
 animate__animated animate__slideInRight
        "
        >
          <XCircleIcon
            className="absolute  w-8 h-8  -top-2 -right-2  z-50 text-gray-600 cursor-pointer "
            onClick={() => {
              setOpen(!open);
            }}
          />
          <div className="w-[95%] md:w-[85%] flex flex-col items-center gap-1 mb-4">
            <p className=" text-gray-500 font-semibold">List of applicants</p>
            <hr className="w-full mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
          </div>
          <div
            className="w-[95%] md:w-[85%] flex flex-col items-center gap-4 py-4
        scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full
        scrollbar-track-rounded-full scrollbar-track-h-20 scrollbar-track-mt-2  overflow-y-scroll
        "
          >
            {applicantList.map((el, index) => (
              <Fragment key={index}>
                <div className="w-[90%] h-auto py-2 px-3 bg-gray-200 rounded-lg flex cursor-pointer shadow-lg hover:scale-[102%] gap-1" style={{ justifyContent:"space-between"}}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`/employee/${el?.user?._id}/${jobId}`}
                    key={el?.user?._id}
                  >
                    <p className="  text-sm text-gray-500">{el?.user?.name}</p>
                    <p className="  text-xs text-gray-500">
                      {el?.publicFields?.includes("email")
                        ? el?.user?.email
                        : null}
                    </p>
                  </Link>
                  <EnvelopeIcon
                    className="w-5 h-5"
                    onClick={() => {
                      handleCreateChatApi(el?.user?._id);
                    }}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicanList;
