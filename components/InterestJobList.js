import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardSubHeader, CardBody, CardFooter } from "./Card";
import {
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import notify from "../utils/tostNotification";
import axios from "axios";
import JobDetailsModal from "../components/employee/JobDetailsModal";
import dateFormater from "../utils/dateFormater";
import PrivatePublicFieldConfirmationModal from "./employee/PrivatePublicFieldConfirmationModal";
const InterestJobList = ({ jobList, setJobList }) => {
  const { data: session } = useSession();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [singleJob, setSingleJob] = useState(null);
  const [fields, setFields] = useState(false);

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

  //handle remove from apply list and add to save list
  const unapplyAndSave = async (id) => {
    try {
      let response = await axios.put(
        `/api/private/user/applySave/${session?.id}`,
        {
          jobId: id,
          action: "unapplyAndSave",
        }
      );
      let updatedJobList = response?.data?.result;
      delete updatedJobList._id;
      setJobList(updatedJobList);
      notify("Moved to save list", "success");
    } catch (error) {
      notify("Something Went wrong", "error");
    }
  };
  //Handle unapply
  const unapply = async (id) => {
    try {
      let response = await axios.put(
        `/api/private/user/applySave/${session?.id}`,
        {
          jobId: id,
          action: "unapply",
        }
      );
      let updatedJobList = response?.data?.result;
      delete updatedJobList._id;
      setJobList(updatedJobList);
      notify("Successfully remove from interest list", "success");
    } catch (error) {
      notify("Something Went wrong", "error");
    }
  };

  return (
    <>
      {jobList?.appliedJobs?.length < 1 ? (
        <div className="absolute flex gap-2 justify-center items-center top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 ">
          <InformationCircleIcon className="w-8 h-8 text-gray-600" />
          <p className="text-gray-600 text-lg ">
            {" "}
            There is no job in Interest list
          </p>
        </div>
      ) : (
        jobList?.appliedJobs.map((el) => {
          return (
            <Card
              key={el._id}
              style={
                "flex flex-col   border-[1px] bg-gray-100 p-4 shadow-lg rounded-lg space-y-2 "
              }
            >
              <CardHeader style={"flex  justify-between items-start"}>
                <div
                  onClick={() => {
                    setShowDetailsModal(true);
                    setSingleJob(el);
                  }}
                  className=" text-primary-100 text-xl font-bold hover:underline cursor-pointer w-[80%]"
                >
                  {" "}
                  {el.title}
                </div>
                <div className="flex gap-2 justify-center items-center text-gray-600 w-[20%]">
                  <XMarkIcon
                    onClick={() => {
                      unapply(el._id);
                    }}
                    className="w-6 h-6 hover:text-gray-800 cursor-pointer active:scale-95"
                  />
                  <AdjustmentsHorizontalIcon
                    className="w-6 h-6 hover:text-gray-800 cursor-pointer active:scale-95"
                    onClick={() => {
                      setFields(true);
                      setSingleJob(el);
                    }}
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
                    unapplyAndSave(el._id);
                  }}
                  className=" w-12 h-12 sm:w-10 sm:h-10 mt-4 sm:mt-1 cursor-pointer drop-shadow-lg text-secondary-100"
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

      {fields && singleJob && (
        <PrivatePublicFieldConfirmationModal
          singleJob={singleJob}
          setSingleJob={setSingleJob}
          open={fields}
          setOpen={setFields}
        />
      )}
    </>
  );
};

export default InterestJobList;
