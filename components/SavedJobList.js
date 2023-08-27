import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardSubHeader, CardBody, CardFooter } from "./Card";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import notify from "../utils/tostNotification";
import JobDetailsModal from "./employee/JobDetailsModal";
import dateFormater from "../utils/dateFormater";

const SavedJobList = ({ jobList, setJobList }) => {
  const { data: session } = useSession();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [singleJob, setSingleJob] = useState();

  useEffect(() => {
    if (showDetailsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailsModal]);

  //Handle Apply and unsave
  const applyAndUnsave = async (id) => {
    try {
      let response = await axios.put(
        `/api/private/user/applySave/${session?.id}`,
        {
          jobId: id,
          action: "applyAndUnsave",
        }
      );
      let updatedJobList = response?.data?.result;
      delete updatedJobList._id;
      setJobList(updatedJobList);
      notify("Moving to your interested jobs", "success");
    } catch (error) {
      notify("Something Went wrong", "error");
    }
  };
  //Handle remove from save list
  const unsave = async (id) => {
    try {
      let response = await axios.put(
        `/api/private/user/applySave/${session?.id}`,
        {
          jobId: id,
          action: "unsave",
        }
      );
      let updatedJobList = response?.data?.result;

      delete updatedJobList._id;
      setJobList(updatedJobList);
      notify("Successfully remove from save list", "success");
    } catch (error) {
      notify("Something Went wrong", "error");
    }
  };

  return (
    <>
      {" "}
      {jobList?.savedJobs?.length < 1 ? (
        <div className="absolute flex gap-2 justify-center items-center top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 ">
          <InformationCircleIcon className="w-8 h-8 text-gray-600" />
          <p className="text-gray-600 text-lg ">
            {" "}
            There is no job in save list
          </p>
        </div>
      ) : (
        jobList?.savedJobs.map((el) => {
          return (
            <Card
              key={el._id}
              style={
                "flex flex-col   border-[1px] bg-gray-100 p-4 shadow-lg rounded-lg space-y-2"
              }
            >
              <CardHeader style={"flex  justify-between items-center"}>
                <div
                  onClick={() => {
                    setShowDetailsModal(true);
                    setSingleJob(el);
                  }}
                  className=" text-primary-100 text-xl font-bold hover:underline cursor-pointer"
                >
                  {" "}
                  {el.title}
                </div>
                <div className="flex gap-2 justify-center items-center text-gray-600">
                  <XMarkIcon
                    onClick={() => {
                      unsave(el._id);
                    }}
                    className="w-6 h-6 hover:text-gray-800 cursor-pointer active:scale-95"
                  />
                </div>
              </CardHeader>
              <CardSubHeader style="flex flex-col items-start justify-center">
                <div className=" text-gray-600 text-xs font-semibold ">
                  {" "}
                  Comapany Name: {el?.recruiter}
                </div>
                <div className=" text-gray-600 text-xs font-semibold ">
                  {" "}
                  Contact Person: {el?.contactPersonName}
                </div>
              </CardSubHeader>
              <CardBody style="flex flex-col items-start justify-center">
                <div className=" text-gray-600 text-sm font-semibold  ">
                  {" "}
                  Summary:
                </div>
                <div className=" flex flex-col gap-1">
                  <p className=" text-gray-700 text-xs">
                    Location: {el.location}
                  </p>
                  {el?.vacancies && (
                    <p className=" text-gray-700 text-xs">
                      Vacancies: {el?.vacancies}
                    </p>
                  )}
                  <p className=" text-gray-700 text-xs">Type: {el?.type}</p>
                  {el?.salary && (
                    <p className=" text-gray-700 text-xs">
                      Salary : {el?.salary} per anum
                    </p>
                  )}
                  {el?.deadline && (
                    <p className=" text-gray-700 text-xs">
                      Deadline : {dateFormater(el?.deadline)}
                    </p>
                  )}
                </div>
              </CardBody>
              <CardFooter style="flex  items-center  justify-center">
                <CheckCircleIcon
                  onClick={() => {
                    applyAndUnsave(el._id);
                  }}
                  className="w-12 h-12 sm:w-10 sm:h-10 mt-4 sm:mt-1 cursor-pointer drop-shadow-lg text-primary-100 "
                />
              </CardFooter>
            </Card>
          );
        })
      )}
      {showDetailsModal && singleJob && (
        <JobDetailsModal
          singleJob={singleJob}
          setSingleJob={setSingleJob}
          setShowDetailsModal={setShowDetailsModal}
          animation="animate__slideInRight"
        />
      )}
    </>
  );
};

export default SavedJobList;
