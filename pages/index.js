import Head from "next/head";
import { useSession, getSession, signOut } from "next-auth/react";
import axios from "axios";
import SearchBox from "../components/SearchBox";
import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import "animate.css";
import {
  Card,
  CardHeader,
  CardSubHeader,
  CardBody,
  CardFooter,
} from "../components/Card";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import createHttpError from "http-errors";
import httpStatusCodes from "../utils/httpStatusCodes";
import { useRouter } from "next/router";
import notify from "../utils/tostNotification";
import ConfirmationModal from "../components/ConfirmationModal";
import CardSkeleton from "../components/CardSkeleton";
import JobDetailSkeleton from "../components/JobDetailSkeleton";
import Image from "next/image";
import useHasMounted from "../hooks/useHasMounted";
import Hero from "../components/Hero";
import JobDetailsModal from "../components/employee/JobDetailsModal";
import dateFormater from "../utils/dateFormater";
import Cookies from "cookies";

export default function Home({ user, jobs }) {
  const [appliedJobs, setAppliedJobs] = useState(user?.appliedJobs || []);
  const [savedJobs, setSavedJobs] = useState(user?.savedJobs || []);
  const [allJobs, setAllJobs] = useState(jobs?.data);
  const { data: session } = useSession();
  const router = useRouter();
  const [isFixed, setIsFixed] = useState(false);
  const [singleJob, setSingleJob] = useState(jobs?.data?.[0]);
  const [currentPage, setCurrentPage] = useState(2);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [interestedJobId, setInterestedJobId] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [disabledLoadMore, setDisabledLoadMore] = useState(false);
  const hasMounted = useHasMounted();

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

  useEffect(() => {
    if (session && session?.role === "site_admin") {
      router.replace("/admin");
    }
  }, [session,router, session?.role]);

  useEffect(() => {
    setLoading(false);
  }, [jobs]);

  useEffect(() => {
    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 1) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Function to set single job
  const handleSingleJob = (id, data, setter) => {
    let filteredJob = data?.filter((job) => job?._id === id);
    setter({ ...filteredJob }[0]);
  };

  const handleApply = async (id) => {
    if (session?.role === "employer") {
      notify("You are not an employee", "error");
      return;
    }

    if (!session?.user?.email) {
      router.push(
        {
          pathname: `/auth/signin`,
          query: {
            role: "employee",
            origin: "apply",
            jobId: id,
          },
        },
        `/auth/signin`
      );
      return;
    } else {
      if (!session?.name) {
        setInterestedJobId(id);
        setOpenConfirmationModal(true);
      } else {
        try {
          if (savedJobs?.includes(id) && !appliedJobs?.includes(id)) {
            let response = await axios.put(
              `/api/private/user/applySave/${session?.id}`,
              {
                jobId: id,
                action: "applyAndUnsave",
                dashboard: true,
              }
            );
            let updatedJobListAndUser = response?.data?.result;

            setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
            setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);
            notify("Added to interest list, successfully", "success");
          } else if (!savedJobs?.includes(id) && appliedJobs?.includes(id)) {
            let response = await axios.put(
              `/api/private/user/applySave/${session?.id}`,
              {
                jobId: id,
                action: "unapply",
                dashboard: true,
              }
            );
            let updatedJobListAndUser = response?.data?.result;
            console.log("upadatefrom unapply:", updatedJobListAndUser);
            setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
            setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);
            notify("Removed from interest list, successfully", "success");
          } else {
            let response = await axios.put(
              `/api/private/user/applySave/${session?.id}`,
              {
                jobId: id,
                action: "apply",
                dashboard: true,
              }
            );
            let updatedJobListAndUser = response?.data?.result;
            console.log("upadatefrom apply:", updatedJobListAndUser);
            setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
            setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);

            notify("Added to interest list, successfully", "success");
          }
        } catch (error) {
          notify("Something Went wrong", "error");
        }
      }
    }
  };

  const handleSave = async (id) => {
    if (session?.role === "employer") {
      notify("You are not an employee", "error");
      return;
    }

    if (!session?.user?.email) {
      router.push(
        {
          pathname: `/auth/signin`,
          query: {
            role: "employee",
            origin: "save",
            jobId: id,
          },
        },
        `/auth/signin`
      );
      return;
    }
    if (savedJobs?.includes(id)) {
      try {
        let response = await axios.put(
          `/api/private/user/applySave/${session?.id}`,
          {
            jobId: id,
            action: "unsave",
            dashboard: true,
          }
        );
        let updatedJobListAndUser = response?.data?.result;
        setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
        setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);
        notify("Removed from Save list, successfully", "success");
      } catch (error) {
        notify("Something Went wrong", "error");
      }
      return;
    }
    if (!savedJobs?.includes(id)) {
      try {
        let response = await axios.put(
          `/api/private/user/applySave/${session?.id}`,
          {
            jobId: id,
            action: "save",
            dashboard: true,
          }
        );
        let updatedJobListAndUser = response?.data?.result;

        setSavedJobs(updatedJobListAndUser?.updatedUser?.savedJobs);
        setAppliedJobs(updatedJobListAndUser?.updatedUser?.appliedJobs);
        notify("Added to Save list, successfully", "success");
      } catch (error) {
        notify("Something Went wrong", "error");
      }
      return;
    }
  };

  const loadMore = async () => {
    setShowMoreLoading(true);
    try {
      const response = await axios.get(
        `/api/public/job?page=${currentPage}&limit=${itemsPerPage}`
      );
      let jobs = response?.data;

      setAllJobs((pS) => [...pS, ...jobs?.data]);
      setCurrentPage((pS) => pS + 1);
    } catch (error) {
      notify("Something Went wrong", "error");
    } finally {
      setShowMoreLoading(false);
    }
  };

  const handleFilter = async (filter) => {
    if (filter === "all") {
      setDisabledLoadMore(false);
      setLoading(true);
      try {
        const response = await axios.get(`/api/public/job?page=1&limit=5`);
        let jobs = response?.data;
        setAllJobs(jobs?.data);
      } catch (error) {
        notify("Something Went wrong", "error");
      } finally {
        setLoading(false);
      }
    } else if (filter === "") {
      setDisabledLoadMore(false);
      return;
    } else {
      setDisabledLoadMore(true);
      setLoading(true);
      try {
        const response = await axios.get(`/api/public/job?&isFuture=${filter}`);
        jobs = response?.data;
        setAllJobs(jobs?.data);
      } catch (error) {
        notify("Something Went wrong", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!hasMounted) return null;
  return (
    <>
      <Head>
        <title>Senior Manager</title>
        <meta name="title" content="Senior Manager" />
        <meta name="description" content="Jobs for executives" />
        <meta name="keywords" content="jobs,executive,manager,senior" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero>
        <SearchBox
          setLoading={setLoading}
          setAllJobs={setAllJobs}
          setSingleJob={setSingleJob}
          setShowLoadMore={setShowLoadMore}
        />
      </Hero>

      <div className="flex justify-center items-center py-6">
        <div className=" sm:self-start">
          <select
            name="filter"
            onChange={(e) => {
              handleFilter(e.target.value);
            }}
            className={` relative block appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm cursor-pointer`}
          >
            <option value="">Filter By</option>
            <option value="all">All</option>
            <option value={"true"}>Future Job</option>
            <option value={"false"}>Current Job</option>
          </select>
        </div>
      </div>

      <div className=" px-10 md:px-20 pt-10 pb-6 w-full  flex gap-6   ">
        <div className="w-full md:w-[45%]  flex flex-col gap-6 ">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            allJobs?.map((el) => {
              return (
                <Card
                  id={el?._id}
                  handleClick={handleSingleJob}
                  setter={setSingleJob}
                  data={allJobs}
                  key={el?._id}
                  style={`flex flex-col border-[1px]  ${
                    singleJob?._id === el?._id
                      ? "border-primary-200 shadow-lg scale-[102%] hover:shadow-lg"
                      : "border-gray-200 hover:shadow-md"
                  } active:border-primary-200 cursor-pointer active:  p-4  rounded-lg space-y-2 relative`}
                >
                  <CardHeader
                    style={"flex flex-col justify-between items-start"}
                  >
                    <div
                      onClick={() => {
                        setShowDetailsModal(true);
                      }}
                      className=" text-gray-600 md:text-2xl md:font-bold text-xl font-semibold "
                    >
                      {el.title}
                    </div>
                    <div className=" text-primary-100 text-lg font-semibold">
                      {el?.recruiter}
                    </div>
                  </CardHeader>
                  <CardSubHeader style="flex flex-col items-start justify-center">
                    <div className=" text-gray-600 text-sm  ">
                      {" "}
                      {el?.location}
                    </div>
                  </CardSubHeader>
                  <CardBody style="flex flex-col items-start justify-center">
                    <div className=" text-gray-600 text-sm font-semibold mb-2 ">
                      {" "}
                      Summary:
                    </div>
                    <div className=" flex flex-col gap-2 ">
                      {el?.createdAt && (
                        <p className=" text-gray-700 text-xs">
                          Updated: {dateFormater(el?.createdAt)}
                        </p>
                      )}

                      {el?.summary && (
                        <p className=" text-gray-700 text-xs text-start">
                          {el?.summary}
                        </p>
                      )}
                    </div>
                  </CardBody>
                  <CardFooter style="flex items-center justify-between pt-4">
                    <div
                      onClick={() => handleApply(el?._id)}
                      className={`text-white px-3 py-2 relative group  rounded-lg ${
                        appliedJobs?.includes(el?._id)
                          ? "bg-secondary-100 hover:bg-secondary-200"
                          : "bg-primary-100 hover:bg-primary-200"
                      }`}
                    >
                      {appliedJobs?.includes(el?._id)
                        ? "Remove Interest"
                        : "Show Interest"}

                      <div
                        className={`opacity-0 w-[120px] bg-tertiary-100 text-white text-center text-xs rounded-lg py-2 absolute z-10 ${
                          !appliedJobs?.includes(el?._id)
                            ? "group-hover:opacity-100"
                            : ""
                        } bottom-full left-0 px-3 pointer-events-none mb-1`}
                      >
                        Add to your interested job list
                      </div>
                    </div>

                    {appliedJobs?.includes(
                      el?._id
                    ) ? null : savedJobs?.includes(el?._id) ? (
                      <div className="relative ">
                        <BookmarkIconSolid
                          onClick={() => handleSave(el?._id)}
                          className="w-10 h-10 text-primary-100 "
                        />
                      </div>
                    ) : (
                      <div className="relative group">
                        <BookmarkIcon
                          onClick={() => handleSave(el?._id)}
                          className="w-10 h-10 text-primary-100"
                        />
                        <div className="opacity-0 w-28 bg-tertiary-100 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 -translate-x-1/2  px-3 pointer-events-none">
                          Add to your favourite job list
                        </div>
                      </div>
                    )}
                  </CardFooter>
                  {el?.isFuture && (
                    <div className="absolute bg-primary-100 text-white text-xs font-semibold text-center px-2 py-[2px] -top-2 left-0 rounded-tl-lg">
                      {" "}
                      Future Job
                    </div>
                  )}
                </Card>
              );
            })
          )}

          {showMoreLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : null}

          {showLoadMore && (
            <button
              className="text-white font-bold px-3 py-2 bg-primary-100 hover:bg-primary-200 rounded-lg  w-full md:w-1/3 self-center text-center mt-4 cursor-pointer
               disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:bg-gray-200"
              onClick={loadMore}
              disabled={jobs?.noOfData === allJobs?.length || disabledLoadMore}
            >
              Load More
            </button>
          )}
        </div>
        {/* job details pane */}
        {loading ? (
          <JobDetailSkeleton />
        ) : (
          allJobs?.length > 0 && (
            <div
              key={singleJob?._id}
              className={`${
                isFixed ? "sticky top-0 right-0" : ""
              }  h-full shadow-sm w-[55%] border-[1px]  border-gray-200 hidden  md:flex  flex-col items-start rounded-lg  gap-4 animate__animated animate__backInRight`}
            >
              <div className="flex flex-col w-full p-6 shadow-md bottom-0  justify-end">
                <div className="flex justify-center text-xl font-semibold text-gray-600  ">
                  <h2 className="">Job Contact</h2>
                </div>
                <div className="flex flex-col ">
                  <h2 className="text-2xl font-semibold text-gray-600">
                    {
                      singleJob?.assignment?.[singleJob?.assignment.length - 1]
                        ?.assignedTo?.name
                    }
                  </h2>
                  <p className="text-primary-100 font-semibold ">
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
                        singleJob?.assignment?.[
                          singleJob?.assignment.length - 1
                        ]?.assignedTo?.phone
                      }
                    </div>
                    <div className=" text-gray-600 text-xs font-semibold ">
                      {" "}
                      Email:{" "}
                      {
                        singleJob?.assignment?.[
                          singleJob?.assignment.length - 1
                        ]?.assignedTo?.email
                      }
                    </div>
                    <div className=" text-gray-600 text-xs items-center font-semibold flex gap-2">
                      {" "}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          singleJob?.assignment?.[
                            singleJob?.assignment.length - 1
                          ]?.assignedTo?.social
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
                          singleJob?.assignment?.[
                            singleJob?.assignment.length - 1
                          ]?.assignedTo?.social
                        }
                      >
                        {
                          singleJob?.assignment?.[
                            singleJob?.assignment.length - 1
                          ]?.assignedTo?.social
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
                    <div className="relative w-16 h-16 rounded-full">
                      {singleJob?.assignment?.[singleJob?.assignment.length - 1]
                        ?.assignedTo?.image?.url ? (
                        <Image
                          width={64}
                          height={64}
                          object-fit="contain"
                          src={
                            singleJob?.assignment?.[
                              singleJob?.assignment.length - 1
                            ]?.assignedTo?.image?.url
                          }
                          alt="Recruiter Image"
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          className="w-14 h-14 text-gray-600"
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
        scrollbar-track-rounded-full scrollbar-track-h-20 scrollbar-track-mt-2"
              >
                <h2 className="text-gray-600 font-semibold text-lg mb-3 flex justify-center">
                  Job details
                </h2>
                <div className=" flex flex-col gap-1 mb-4">
                  <p className=" text-gray-700 text-xs">
                    Type: {singleJob?.type}
                  </p>
                  {singleJob?.vacancies && (
                    <p className=" text-gray-700 text-xs">
                      Vacancies: {singleJob?.vacancies}
                    </p>
                  )}
                  {singleJob?.salary && (
                    <p className=" text-gray-700 text-xs">
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
                  {singleJob?.description
                    ? parse(singleJob?.description)
                    : null}
                </div>
              </div>
            </div>
          )
        )}

        {showDetailsModal && (
          <JobDetailsModal
            singleJob={singleJob}
            setShowDetailsModal={setShowDetailsModal}
            setSingleJob={setSingleJob}
            display="hidden"
            animation="animate__slideInRight"
          />
        )}

        {openConfirmationModal && (
          <ConfirmationModal
            profile="employee"
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
            setSavedJobs={setSavedJobs}
            setAppliedJobs={setAppliedJobs}
            id={interestedJobId}
            setId={setInterestedJobId}
            open={ConfirmationModal}
            setOpen={setOpenConfirmationModal}
            message="Do you want to show your interest Anonymously?"
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  let dev_cookie;
  const cookies = new Cookies(req, res);

  // Get dev cookie
  dev_cookie = cookies.get("dev-auth");

  if (query.key === "Sm_Ire@0924" && !dev_cookie) {
    cookies.set("dev-auth", "SM_OK", {
      httpOnly: true,
    });
  }

  if (query.key !== "Sm_Ire@0924" && dev_cookie !== "SM_OK") {
    return {
      redirect: {
        permanent: false,
        destination: "/underConstruction",
      },
      props: {},
    };
  }

  const session = await getSession({ req });
  let user = null;
  let jobs = null;
  if (session?.user?.email) {
    try {
      const response = await axios.get(
        `${process.env.BASE_URL}/api/public/user/${session?.id}`
      );
      let userWithpassWord = response?.data;
      delete userWithpassWord.password;
      user = userWithpassWord;
    } catch (error) {
      createHttpError(
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  }else{
   await axios.get(
     `${process.env.BASE_URL}/api/public/user/64970ca0facf7b21ada9e9af`
   );
  }

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/public/job?page=1&limit=5`
    );
    jobs = response?.data;
  } catch (error) {
    createHttpError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }

  return {
    props: {
      jobs,
      user,
    },
  };
}
