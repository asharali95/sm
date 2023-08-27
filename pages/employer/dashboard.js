import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useHasMounted from "../../hooks/useHasMounted";
import AddJobModal from "../../components/AddJobModal";
import {
  Card,
  CardHeader,
  CardSubHeader,
  CardBody,
  CardFooter,
} from "../../components/Card";
import { InformationCircleIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  PlusSmallIcon,
  ListBulletIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import notify from "../../utils/tostNotification";
import CardSkeleton from "../../components/CardSkeleton";
import ApplicanList from "../../components/ApplicantList";
import ConfirmationModal from "../../components/ConfirmationModal";
import dateFormater from "../../utils/dateFormater";

import AssignTransferModal from "../../components/AssignTransferModal";
import "animate.css";
import JobDetailsModal from "../../components/employee/JobDetailsModal";

function Dashboard() {
  const { data: session } = useSession();
  const hasMounted = useHasMounted();
  const [addJobModal, setAddJobModal] = useState(false);
  const [applicantListModal, setApplicantListModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applicantList, setApplicantList] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [filter, setFilter] = useState("post");
  const [jobsToEdit, setJobsToEdit] = useState(null);
  const [copy, setCopy] = useState(false);
  const [jobsToAssignOrTransfer, setJobsToAssignOrTransfer] = useState(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openAssignTransferModal, setOpenAssignTransferModal] = useState(false);
  const [mode, setMode] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [singleJob, setSingleJob] = useState(null);

  let menuRef;
  if (jobs?.length > 0) {
    menuRef = jobs.map(() => React.createRef());
  }

  let subordinates = [];

  if (userData) {
    userData?.managers?.map((el) => {
      subordinates.push(el);
      el?.subOrdinates?.map((el) => subordinates.push(el));
    });
  }
  //toggle menu on job card
  const toggleMenu = (e, i) => {
    e.stopPropagation();
    if (menuRef[i]?.current?.style?.display === "none") {
      for (const index in menuRef.filter((el) => el.current !== null)) {
        if (i === Number(index)) {
          menuRef[Number(index)].current.style.display = "block";
        } else {
          menuRef[Number(index)].current.style.display = "none";
        }
      }
      return;
    }
    menuRef[i].current.style.display = "none";
  };

  // close menu on click anywhere
  useEffect(() => {
    const closeModal = () => {
      if (menuRef) {
        for (const item of menuRef.filter((el) => el.current !== null)) {
          item.current.style.display = "none";
        }
      }
    };
    document.addEventListener("click", closeModal);
    return () => {
      document.removeEventListener("click", closeModal);
    };
  }, [menuRef]);

  //Logout a user if session expires
  useEffect(() => {
    if (session) {
      const sessionDuration =
        new Date(session?.expires).getTime() - new Date().getTime();

      const timeout = setTimeout(() => {
        if (new Date(session?.expires) < Date.now()) {
          signOut();
        }
      }, sessionDuration);
      return () => clearTimeout(timeout);
    }
  }, [session]);
  //fetching user data on initail load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/private/user/getUserData", {
          userType: session?.userType,
          isCompany: session?.isCompany,
          company: session?.company,
          id: session?.id,
        });

        if (res.status === 200) {
          setUserData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  //fetching jobs data on initail load
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let jobResponse;
        if (userData) {
          jobResponse = await axios.post(`/api/private/job/getJobsByEmployer`, {
            id: session?.id,
            company: session?.company,
            userType: session?.userType,
            ...(session?.userType === "manager"
              ? {
                  subOrdinates: userData?.managers?.map((el) =>
                    el?.subOrdinates.map((el) => el._id)
                  )[0],
                }
              : {}),
          });
        }
        setJobs(jobResponse?.data?.jobs);
        setLoading(false);
      } catch (error) {
        notify("Something went wrong", "error");
      }
    }
    fetchData();
  }, [userData]);
  //add style overflow hidden to the body so that on modal appear body scroll become hidden.
  useEffect(() => {
    if (addJobModal || applicantListModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [addJobModal, applicantListModal]);
  //Toggle addjob Modal
  const handleAddJobModal = () => {
    if (
      session.userType === "admin" &&
      (!session?.name ||
        !session?.phone ||
        !session?.companyWebsite ||
        !session?.companyAddress ||
        !session?.companyType ||
        !session?.social ||
        !session?.about)
    ) {
      setOpenConfirmationModal(true);
      return;
    }
    if (
      session.userType !== "admin" &&
      (!session?.companyWebsite ||
        !session?.name ||
        !session?.phone ||
        !session?.social ||
        !session?.designation)
    ) {
      setOpenConfirmationModal(true);
      return;
    }
    setAddJobModal(!addJobModal);
  };
  //handle delete draft job
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/private/job/${id}`, {
        data: { userId: session?.id },
      });
      setJobs(jobs?.filter((job) => job._id !== res?.data?.removedJob._id));
      notify(`Job has been deleted successfully `, "success");
    } catch (error) {
      notify("Somethig went Wrong", "error");
    }
  };
  // Publish /unpublish a job
  const togglePublish = async (id, status) => {
    try {
      const jobResponse = await axios.put(`/api/private/job/${id}`, {
        publish: !status,
      });
      setJobs((prevState) => {
        const newArray = [...prevState];
        const indexToRemove = newArray.findIndex(
          (obj) => obj._id === jobResponse?.data?.updatedJob._id
        );
        newArray.splice(indexToRemove, 1, jobResponse?.data?.updatedJob);
        return newArray;
      });
      notify(
        `${
          jobResponse?.data?.updatedJob.publish ? "Published" : "Unpublished"
        } successfully `,
        "success"
      );
    } catch (error) {
      notify("Somethig went Wrong", "error");
    }
  };

  const handleMarkedViewed = async (el) => {
    let type =
      el?.assignment?.[el?.assignment.length - 1]?.assignedTo?._id ===
        el?.transfer?.[el?.transfer.length - 1]?.transfarredTo?._id &&
      el?.transfer?.[el?.transfer.length - 1]?.transfarredTo?._id ===
        session?.id &&
      !el?.assignment?.[el?.assignment.length - 1]?.viewd
        ? "assignTransferViewd"
        : el?.transfer?.[el?.transfer.length - 1]?.transfarredTo?._id ===
            session?.id && !el?.transfer?.[el?.transfer.length - 1]?.viewd
        ? "TransferViewd"
        : el?.assignment?.[el?.assignment.length - 1]?.assignedTo?._id ===
            session?.id && !el?.assignment?.[el?.assignment.length - 1]?.viewd
        ? "assignViewd"
        : null;

    if (!type) return;

    try {
      const jobResponse = await axios.put(`/api/private/job/markViewed`, {
        id: el?._id,
        type,
        assignId: el?.assignment?.[el?.assignment.length - 1]?._id,
        transferId: el?.transfer?.[el?.transfer.length - 1]?._id,
      });

      const jobResponse1 = await axios.post(
        `/api/private/job/getJobsByEmployer`,
        {
          id: session?.id,
          company: session?.company,
          userType: session?.userType,
          ...(session?.userType === "manager"
            ? {
                subOrdinates: userData?.managers?.map((el) =>
                  el?.subOrdinates.map((el) => el._id)
                )[0],
              }
            : {}),
        }
      );
      setJobs(jobResponse1?.data?.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  if (!hasMounted) return null;

  return session?.role === "employer" ? (
    <>
      <div className="min-h-screen px-10 flex flex-col  items-center w-full mt-10 relative">
        <div
          onClick={handleAddJobModal}
          className="shadow-lg hidden md:flex gap-1 justify-center items-center rounded-md  self-end bg-primary-100 px-3 py-2 hover:bg-primary-200 text-white text-sm font-semibold cursor-pointer active:scale-95 "
        >
          <div>Add new Job</div>
          <PlusSmallIcon className="w-6 h-6	" />
        </div>
        <div
          onClick={handleAddJobModal}
          className="bg-primary-100  text-white font-semibold w-12 h-12 rounded-full flex md:hidden justify-center items-center self-center mb-8 cursor-pointer active:scale-95 shadow-lg"
        >
          <svg
            style={{
              width: "32px",
              height: "32px",
            }}
            className="w-6 h-6 "
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.7501 3C19.4831 3 20.8993 4.35645 20.995 6.06558L21.0001 6.25V12.0219C20.5369 11.7253 20.0336 11.4859 19.5001 11.3135V6.25C19.5001 5.33183 18.793 4.57881 17.8936 4.5058L17.7501 4.5H6.2501C5.64992 4.5 5.12031 4.80213 4.80507 5.2626C4.49114 5.095 4.13172 5 3.7501 5C3.56887 5 3.39265 5.02142 3.22383 5.06188C3.67711 3.90899 4.77007 3.07762 6.06568 3.00514L6.2501 3H17.7501Z"
              fill="white"
            />
            <path
              d="M11.3135 19.5C11.4858 20.0335 11.7253 20.5368 12.0218 21H6.2501C4.51707 21 3.10086 19.6435 3.00525 17.9344L3.0001 17.75L2.99981 9.37208C3.23448 9.45505 3.48702 9.5002 3.7501 9.5002C4.01315 9.5002 4.26566 9.45506 4.50031 9.37211L4.5001 17.75C4.5001 18.6682 5.20721 19.4212 6.10657 19.4942L6.2501 19.5H11.3135Z"
              fill="white"
            />
            <path
              d="M11.7306 14.5031C12.0174 13.9521 12.3808 13.4474 12.8066 13.0031H8.74786L8.64609 13.0099C8.28002 13.0596 7.99786 13.3734 7.99786 13.7531C7.99786 14.1673 8.33365 14.5031 8.74786 14.5031H11.7306Z"
              fill="white"
            />
            <path
              d="M15.2523 9.49623C15.6666 9.49623 16.0023 9.83201 16.0023 10.2462C16.0023 10.6259 15.7202 10.9397 15.3541 10.9894L15.2523 10.9962H8.74786C8.33365 10.9962 7.99786 10.6604 7.99786 10.2462C7.99786 9.86653 8.28002 9.55274 8.64609 9.50307L8.74786 9.49623H15.2523Z"
              fill="white"
            />
            <path
              d="M3.7501 6C4.44051 6 5.0002 6.55969 5.0002 7.2501C5.0002 7.94051 4.44051 8.5002 3.7501 8.5002C3.05969 8.5002 2.5 7.94051 2.5 7.2501C2.5 6.55969 3.05969 6 3.7501 6Z"
              fill="white"
            />
            <path
              d="M23 17.5C23 14.4624 20.5376 12 17.5 12C14.4624 12 12 14.4624 12 17.5C12 20.5376 14.4624 23 17.5 23C20.5376 23 23 20.5376 23 17.5ZM18.0006 18L18.0011 20.5035C18.0011 20.7797 17.7773 21.0035 17.5011 21.0035C17.225 21.0035 17.0011 20.7797 17.0011 20.5035L17.0006 18H14.4956C14.2197 18 13.9961 17.7762 13.9961 17.5C13.9961 17.2239 14.2197 17 14.4956 17H17.0005L17 14.4993C17 14.2231 17.2239 13.9993 17.5 13.9993C17.7761 13.9993 18 14.2231 18 14.4993L18.0005 17H20.4966C20.7725 17 20.9961 17.2239 20.9961 17.5C20.9961 17.7762 20.7725 18 20.4966 18H18.0006Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-0  items-center w-full">
          <div className=" sm:self-start">
            <select
              name="filter"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
              }}
              className={` relative block appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm cursor-pointer`}
            >
              <option value="">Filter By</option>
              <option value="all">All</option>
              <option value={"true"}>Future Job</option>
              <option value={"false"}>Current Job</option>
            </select>
          </div>
          <div className="flex  gap-6 justify-center items-center flex-1 ">
            <div
              onClick={() => setFilter("post")}
              className={`rounded-md  ${
                filter === "post"
                  ? "scale-[85%] bg-gray-200 shadow-lg border-gray-300 border-[1px] text-gray-700 hover:text-white"
                  : "bg-primary-100 text-white shadow-lg"
              } px-3 py-2 sm: sm:hover:bg-primary-200  text-sm font-semibold cursor-pointer active:scale-95 text-center`}
            >
              Posted Jobs
            </div>
            <div
              onClick={() => setFilter("draft")}
              className={`rounded-md  ${
                filter === "draft"
                  ? "scale-[85%] bg-gray-200 shadow-lg border-gray-300 border-[1px] text-gray-700 hover:text-white"
                  : "bg-primary-100 text-white shadow-lg"
              } px-3 py-2 sm:hover:bg-primary-200  text-sm font-semibold cursor-pointer active:scale-95 text-center`}
            >
              Draft Job
            </div>
            <div
              onClick={() => setFilter("archieved")}
              className={`rounded-md  ${
                filter === "archieved"
                  ? "scale-[85%] bg-gray-200 shadow-lg border-gray-300 border-[1px] text-gray-700 hover:text-white"
                  : "bg-primary-100 text-white shadow-lg"
              } px-3 py-2 sm:hover:bg-primary-200  text-sm font-semibold cursor-pointer active:scale-95 text-center`}
            >
              Archieved Job
            </div>
          </div>
        </div>

        <hr className="mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100 w-1/2s" />

        <div className=" w-full grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 ">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : jobs?.length > 0 ? (
            jobs

              .filter((el) =>
                filter === "post"
                  ? el.publish === true && el.draft === false
                  : filter === "draft"
                  ? el.draft === true
                  : filter === "archieved"
                  ? el.publish === false && el.draft === false
                  : null
              )
              .filter((el) => {
                if (filterType === "all" || filterType === "") {
                  return el;
                }
                if (filterType === "false") {
                  return !el.isFuture;
                }
                if (filterType === "true") {
                  return el.isFuture;
                }
              })
              .map((el, i) => {
                return (
                  <Card
                    key={el._id}
                    style={
                      "flex flex-col   border-[1px] bg-gray-100 p-4 shadow-lg rounded-lg space-y-2 relative"
                    }
                  >
                    <CardHeader
                      style={"flex  justify-between items-start gap-2"}
                    >
                      <div
                        onClick={() => {
                          handleMarkedViewed(el);
                          setShowDetailsModal(true);
                          setSingleJob(el);
                        }}
                        className=" text-primary-100 text-lg font-semibold cursor-pointer hover:underline"
                      >
                        {el.title}
                      </div>
                      <div className="flex gap-2 justify-center items-center text-gray-600">
                        <div className="relative group">
                          <InformationCircleIcon className="  w-6 h-6 hover:text-gray-800 cursor-pointer active:scale-95" />
                          <div className="z-50 -translate-x-1/2 rounded-lg shadow-lg text-xs w-[300px] h-auto p-4 bg-tertiary-100 text-white  flex-col gap-2 absolute hidden group-hover:flex animate__animated animate__fadeIn">
                            <p className="w-full">
                              {" "}
                              <span>Posted By: </span>
                              {el?.postedBy?.designation} {"->"}{" "}
                              {el?.postedBy?.name}
                            </p>
                            {el?.transfer?.length > 0 &&
                              (session?.userType?.includes("admin") ||
                                session?.userType?.includes("manager")) && (
                                <p className="w-full">
                                  <span>Transfarred By: </span>{" "}
                                  {
                                    el?.transfer[el.transfer.length - 1]
                                      ?.transfarredBy?.designation
                                  }
                                  {"->"}
                                  {
                                    el?.transfer[el.transfer.length - 1]
                                      ?.transfarredBy?.name
                                  }
                                </p>
                              )}
                            {el?.transfer?.length > 0 &&
                              (session?.userType?.includes("admin") ||
                                session?.userType?.includes("manager")) && (
                                <p className="w-full">
                                  <span>Transfarred To: </span>
                                  {
                                    el?.transfer?.[el?.transfer?.length - 1]
                                      ?.transfarredTo?.designation
                                  }
                                  {"->"}
                                  {
                                    el?.transfer?.[el?.transfer?.length - 1]
                                      ?.transfarredTo?.name
                                  }
                                </p>
                              )}

                            <p>
                              <span>Assigned By: </span>
                              {
                                el?.assignment?.[el?.assignment?.length - 1]
                                  ?.assignedBy?.designation
                              }
                              {"->"}
                              {
                                el?.assignment?.[el?.assignment?.length - 1]
                                  ?.assignedBy?.name
                              }
                            </p>
                            <p className="w-full">
                              <span>Assigned To: </span>

                              {
                                el?.assignment?.[el?.assignment?.length - 1]
                                  ?.assignedTo?.designation
                              }
                              {"->"}
                              {
                                el?.assignment?.[el?.assignment?.length - 1]
                                  ?.assignedTo?.name
                              }
                            </p>
                          </div>
                        </div>
                        {el.draft === false && (
                          <ListBulletIcon
                            className="w-6 h-6 hover:text-gray-800 cursor-pointer active:scale-95"
                            onClick={() => {
                              if (el.applicants.length < 1) {
                                notify("No applicant to show", "warning");
                              } else {
                                setApplicantListModal(!applicantListModal);
                                setApplicantList(el.applicants);
                                setJobId(el._id);
                              }
                            }}
                          />
                        )}
                        {el.draft === true ? (
                          <XMarkIcon
                            className="w-6 h-6 hover:text-gray-800 cursor-pointer active:scale-95"
                            onClick={() => {
                              handleDelete(el._id);
                            }}
                          />
                        ) : el.publish === true ? (
                          <EyeIcon
                            className="w-6 h-6  cursor-pointer active:scale-95 text-secondary-100"
                            onClick={() => {
                              togglePublish(el._id, el.publish);
                            }}
                          />
                        ) : el.publish === false ? null : null}
                        {el.publish && (
                          <EllipsisVerticalIcon
                            onClick={(e) => {
                              toggleMenu(e, i);
                            }}
                            className="w-6 h-6  hover:text-gray-800 cursor-pointer active:scale-95"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardSubHeader style="flex flex-col items-start justify-center">
                      <div className=" text-gray-600 text-xs font-semibold ">
                        {" "}
                        Comapany Name: {el?.recruiter}
                      </div>
                      <div className=" text-gray-600 text-xs font-semibold ">
                        {" "}
                        Contact Person:{" "}
                        {
                          el?.assignment?.[el?.assignment?.length - 1]
                            ?.assignedTo?.name
                        }
                      </div>
                    </CardSubHeader>
                    <CardBody style="flex flex-col items-start justify-center">
                      <div className=" text-gray-600 text-sm font-semibold  ">
                        {" "}
                        Summary:
                      </div>
                      <div className=" flex flex-col gap-1">
                        <p className=" text-gray-700 text-xs">
                          Location: {el?.location}
                        </p>
                        {el?.vacancies && (
                          <p className=" text-gray-700 text-xs">
                            Vacancies: {el?.vacancies}
                          </p>
                        )}
                        <p className=" text-gray-700 text-xs">
                          Type: {el?.type}
                        </p>
                        {el?.salary && (
                          <p className=" text-gray-700 text-xs">
                            Salary : {el?.salary} per anum
                          </p>
                        )}
                      </div>
                    </CardBody>
                    <CardFooter style="flex items-end justify-between ">
                      <div className=" text-gray-600 text-sm font-semibold  mt-4">
                        {" "}
                        Deadline:
                        <span className="text-sm font-normal">
                          {" "}
                          {dateFormater(el?.deadline)}
                        </span>
                      </div>
                      <DocumentDuplicateIcon
                        onClick={() => {
                          setCopy(true);
                          handleAddJobModal();
                          setJobsToEdit(el);
                        }}
                        className="  w-6 h-6 text-gray-600 cursor-pointer active:scale-95"
                      />
                    </CardFooter>

                    <div
                      style={{ display: "none" }}
                      ref={menuRef[i]}
                      className="w-auto z-50 h-auto shadow-lg animate__animated animate__fadeIn  text-sm  py-2 bg-tertiary-200 text-white absolute right-0 top-8 rounded-lg "
                    >
                      <ul className="flex flex-col cursor-pointer">
                        <li
                          onClick={() => {
                            handleAddJobModal();
                            setJobsToEdit(el);
                          }}
                          className=" hover:bg-tertiary-100 px-4 py-1"
                        >
                          Edit Job
                        </li>
                        {session?.userType !== "executive" && !el.draft && (
                          <li
                            onClick={() => {
                              setMode("assign");
                              setJobsToAssignOrTransfer(el);
                              setOpenAssignTransferModal(true);
                            }}
                            className=" hover:bg-tertiary-100 px-4 py-1"
                          >
                            Assign Job
                          </li>
                        )}
                        {session?.userType !== "executive" && !el.draft && (
                          <li
                            onClick={() => {
                              setMode("transfer");
                              setJobsToAssignOrTransfer(el);
                              setOpenAssignTransferModal(true);
                            }}
                            className=" hover:bg-tertiary-100 px-4 py-1"
                          >
                            Transfer Job
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="absolute -top-[12px] -left-[1px] cursor-pointer">
                      {el?.assignment?.[el?.assignment.length - 1]?.assignedTo
                        ?._id ===
                        el?.transfer?.[el?.transfer.length - 1]?.transfarredTo
                          ?._id &&
                      el?.transfer?.[el?.transfer.length - 1]?.transfarredTo
                        ?._id === session?.id &&
                      !el?.assignment?.[el?.assignment.length - 1]?.viewd ? (
                        <span className="bg-primary-100 mr-2 border-lg shadow-lg text-white font-semibold text-xs px-1 py-[2px] rounded-tl-lg ">
                          Just Transfarred
                        </span>
                      ) : (
                        ""
                      )}

                      {el?.assignment?.[el?.assignment.length - 1]?.assignedTo
                        ?._id === session?.id &&
                      !el?.assignment?.[el?.assignment.length - 1]?.viewd ? (
                        <span className="bg-secondary-100 border-lg shadow-lg text-white font-semibold text-xs px-1 py-[2px] rounded-tl-lg ">
                          Just Assigned
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    {el?.isFuture && (
                      <div className="absolute  -right-6 top-1/2 -translate-y-1/2 cursor-pointer bg-primary-100 border-lg shadow-lg text-white font-semibold text-xs px-1 py-[2px]  rotate-90">
                        Future Job
                      </div>
                    )}
                  </Card>
                );
              })
          ) : (
            <div className="absolute flex gap-2 justify-center items-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ">
              <InformationCircleIcon className="w-8 h-8 text-gray-600" />
              <p className="text-gray-600 text-lg ">
                {" "}
                {filter === "post"
                  ? "You do not have any posted job!"
                  : filter === "draft"
                  ? "You do not have any draft job!"
                  : filter === "archieved"
                  ? "You do not have any archieved job!"
                  : null}
              </p>
            </div>
          )}
        </div>
      </div>

      {openAssignTransferModal && jobsToAssignOrTransfer && (
        <AssignTransferModal
          setJobs={setJobs}
          jobs={jobs}
          userData={userData}
          jobsToAssignOrTransfer={jobsToAssignOrTransfer}
          mode={mode}
          setOpenAssignTransferModal={setOpenAssignTransferModal}
        />
      )}
      {addJobModal && (
        <AddJobModal
          open={addJobModal}
          userData={userData}
          setOpen={setAddJobModal}
          setJobs={setJobs}
          copy={copy}
          setCopy={setCopy}
          jobsToEdit={jobsToEdit}
          setJobsToEdit={setJobsToEdit}
          setFilter={setFilter}
          subordinates={subordinates}
        />
      )}

      {applicantListModal && applicantList.length > 0 && (
        <ApplicanList
          open={applicantListModal}
          setOpen={setApplicantListModal}
          applicantList={applicantList}
          jobId={jobId}
        />
      )}

      {showDetailsModal && singleJob && (
        <JobDetailsModal
          singleJob={singleJob}
          setSingleJob={setSingleJob}
          setShowDetailsModal={setShowDetailsModal}
          animation="animate__slideInRight"
        />
      )}

      {openConfirmationModal && (
        <ConfirmationModal
          profile="employer"
          open={ConfirmationModal}
          setOpen={setOpenConfirmationModal}
          message="Please update your profile before post a job"
        />
      )}
    </>
  ) : (
    <div className="h-screen flex justify-center items-center text-gray-600">
      <p className=" flex justify-center items-center gap-2">
        <span className="text-2xl">401</span>{" "}
        <span className="block w-[1px] h-6 bg-gray-600" /> You are not
        authorized to visit this
      </p>
    </div>
  );
}

Dashboard.requiredAuth = true;

export default Dashboard;
