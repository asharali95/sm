import { XCircleIcon } from "@heroicons/react/24/solid";
import parse from "html-react-parser";
import Image from "next/image";
import "animate.css";
import dateFormater from "../../utils/dateFormater";

const JobDetailsModal = ({
  singleJob,
  setShowDetailsModal,
  setSingleJob,
  display,
  animation,
}) => {
  return (
    <div
      style={{ height: " 100% " }}
      className={`bg-gray-700/30   z-50 fixed inset-0 flex  justify-center items-center  md:${display}`}
    >
      <div
        key={singleJob?._id}
        className={`bg-gray-50 relative shadow-sm w-[90%] md:w-[45%] border-[1px]  border-gray-200  flex flex-col items-start rounded-lg  gap-4 job_details_modal_height animate__animated ${animation}`}
      >
        <XCircleIcon
          className="absolute  w-8 h-8  -top-2 -right-2  z-50 text-gray-600 cursor-pointer  animate__animated animate__fadeIn "
          onClick={() => {
            setShowDetailsModal(false);
            setSingleJob(null);
          }}
        />
        <div className="flex flex-col w-full p-6 shadow-md bottom-0 justify-end">
          <div className="flex justify-center text-xl font-semibold text-gray-600 pt-2 ">
            <h2 className="">Job Contact</h2>
          </div>
          <div className="flex flex-col ">
            <h2 className="text-2xl font-semibold text-gray-600">
              {
                singleJob?.assignment?.[singleJob?.assignment.length - 1]
                  ?.assignedTo?.name
              }
            </h2>
            <p className="text-primary-200 font-semibold ">
              {
                singleJob?.assignment?.[singleJob?.assignment.length - 1]
                  ?.assignedTo?.designation
              }
            </p>
          </div>
          <div className="w-full flex items-start">
            <div className="flex flex-col items-start w-[80%] gap-1">
              <div className=" text-gray-600 text-xs font-semibold ">
                {" "}
                Phone:{" "}
                {
                  singleJob?.assignment?.[singleJob?.assignment.length - 1]
                    ?.assignedTo?.phone
                }
              </div>

              <div className=" text-gray-600 text-xs font-semibold ">
                {" "}
                Email:{" "}
                {
                  singleJob?.assignment?.[singleJob?.assignment.length - 1]
                    ?.assignedTo?.email
                }
              </div>

              <div className=" text-gray-600 text-xs items-center font-semibold flex gap-2">
                {" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    singleJob?.assignment?.[singleJob?.assignment.length - 1]
                      ?.assignedTo?.social
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    width="20px"
                    height="20px"
                  >
                    {" "}
                    <path
                      fill="#0077b5"
                      d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"
                    />
                  </svg>
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    singleJob?.assignment?.[singleJob?.assignment.length - 1]
                      ?.assignedTo?.social
                  }
                >
                  {
                    singleJob?.assignment?.[singleJob?.assignment.length - 1]
                      ?.assignedTo?.social
                  }
                </a>
              </div>

              <div className=" text-gray-600 text-xs font-semibold flex gap-4 justify-center items-center">
                <div>Company: {singleJob?.recruiter}</div>
                <div className="h-[12px] w-[.5px] bg-gray-400 rounded-lg"></div>
                <div> Website: {singleJob?.company?.website}</div>
              </div>

              {singleJob?.companyType && (
                <div>
                  <span
                    className={`block text-white text-xs font-semibold rounded-lg py-[2px] px-2 ${
                      singleJob?.companyType === "Agency"
                        ? "bg-secondary-100"
                        : "bg-primary-100"
                    }`}
                  >
                    {" "}
                    {singleJob?.companyType}
                  </span>
                </div>
              )}
            </div>
            <div className="w-[20%] flex justify-end items-start -mt-6">
              <div className="relative w-10 h-10 rounded-full">
                {singleJob?.assignment?.[singleJob?.assignment.length - 1]
                  ?.assignedTo?.image?.url ? (
                  <Image
                    fill
                    object-fit="contain"
                    src={
                      singleJob?.assignment?.[singleJob?.assignment.length - 1]
                        ?.assignedTo?.image?.url
                    }
                    alt="Recruiter Image"
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="w-10 h-10 text-gray-600"
                  >
                    <path
                      fill="#4B5563"
                      d="M352 128C352 198.7 294.7 256 224 256C153.3 256 96 198.7 96 128C96 57.31 153.3 0 224 0C294.7 0 352 57.31 352 128zM209.1 359.2L176 304H272L238.9 359.2L272.2 483.1L311.7 321.9C388.9 333.9 448 400.7 448 481.3C448 498.2 434.2 512 417.3 512H30.72C13.75 512 0 498.2 0 481.3C0 400.7 59.09 333.9 136.3 321.9L175.8 483.1L209.1 359.2z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col w-full p-6 job-details-body overflow-y-scroll text-gray-600 text-sm scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full
        scrollbar-track-rounded-full scrollbar-track-h-20 scrollbar-track-mt-2  "
        >
          <h2 className="text-gray-600 font-semibold text-lg mb-3 flex justify-center">
            Job details
          </h2>
          <div className=" flex flex-col gap-1 mb-4">
            <p className=" text-gray-700 text-sm">
              Location: {singleJob?.location}
            </p>
            <p className=" text-gray-700 text-sm">Type: {singleJob?.type}</p>
            {singleJob?.vacancies && (
              <p className=" text-gray-700 text-sm">
                Vacancies: {singleJob?.vacancies}
              </p>
            )}
            {singleJob?.salary && (
              <p className=" text-gray-700 text-sm">
                Salary : {singleJob?.salary} per anum
              </p>
            )}
            {singleJob?.deadline && (
              <p className=" text-gray-700 text-xs">
                Deadline : {dateFormater(singleJob?.deadline)}
              </p>
            )}
          </div>

          <div>
            {singleJob?.description ? parse(singleJob?.description) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
