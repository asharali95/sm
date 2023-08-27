import { useState } from "react";
import axios from "axios";
import Editor from "./Editor";
import useFormValidation from "../hooks/useFormValidation";
import Error from "./Error";
import { ThreeCircles } from "react-loader-spinner";
import notify from "../utils/tostNotification";
import { XCircleIcon } from "@heroicons/react/24/solid";
import UserPlaceHolder from "../public/images/user.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import "animate.css";
import _ from "lodash";
import stringParser from "../utils/stringParser";
import dateFormater from "../utils/dateFormater";

function AddJobModal({
  open,
  setOpen,
  setJobs,
  userData,
  jobsToEdit,
  setJobsToEdit,
  setFilter,
  subordinates,
  copy,
  setCopy,
}) {
  let initialData = {};
  //Initial data which will be used to keep track if any form data changed.

  if (jobsToEdit) {
    initialData.title = jobsToEdit?.title;
    initialData.description = jobsToEdit?.description;
    initialData.recruiter = jobsToEdit?.recruiter;
    initialData.location = jobsToEdit?.location;
    initialData.type = jobsToEdit?.type;
    initialData.companyType = jobsToEdit?.companyType;
    initialData.salary = jobsToEdit?.salary;
    initialData.summary = jobsToEdit?.summary;
    initialData.deadline = new Date(jobsToEdit?.deadline);
    initialData.vacancies = jobsToEdit?.vacancies;
    initialData.isFuture = jobsToEdit?.isFuture;
  }
  const { data: session } = useSession();
  const [assignee, setAssignee] = useState("");
  const [imageUrl, setImageUrl] = useState(
    jobsToEdit
      ? jobsToEdit?.assignment?.[jobsToEdit?.assignment?.length - 1]?.assignedTo
          ?.imge?.url
      : session?.image?.url
  );
  const [description, setDescription] = useState(jobsToEdit?.description || "");
  const [summary, setSummary] = useState(jobsToEdit?.summary || "");
  const [contactName, setContactName] = useState(
    jobsToEdit?.assignment?.[jobsToEdit?.assignment?.length - 1]?.assignedTo
      ?.name || session?.name
  );
  const [contactEmail, setContactEmail] = useState(
    jobsToEdit?.assignment?.[jobsToEdit?.assignment?.length - 1]?.assignedTo
      ?.email || session?.user?.email
  );
  const [contactPhone, setContactPhone] = useState(
    jobsToEdit?.assignment?.[jobsToEdit?.assignment?.length - 1]?.assignedTo
      ?.phone || session?.phone
  );
  const [contactLinkedInAccount, setContactLinkedInAccount] = useState(
    jobsToEdit?.assignment?.[jobsToEdit?.assignment?.length - 1]?.assignedTo
      ?.social || session?.social
  );
  const [contactDesignation, setContactDesignation] = useState(
    jobsToEdit?.assignment?.[jobsToEdit?.assignment?.length - 1]?.assignedTo
      ?.designation || session?.designation
  );
  const [companyName, setCompanyName] = useState(jobsToEdit?.recruiter || "");
  const [recruiterWebsite, setRecruiterWebsite] = useState(
    session?.companyWebsite
  );
  const [title, setTitle] = useState(jobsToEdit?.title || "");
  const [companyType, setCompanyType] = useState(
    jobsToEdit?.companyType || session?.companyType
  );
  const [type, setType] = useState(jobsToEdit?.type || "");
  const [location, setLocation] = useState(jobsToEdit?.location || "");
  const [minSalary, setMinSalary] = useState(
    jobsToEdit?.salary?.split("-")[1] || ""
  );
  const [maxSalary, setMaxSalary] = useState(
    jobsToEdit?.salary?.split("-")[2] || ""
  );
  const [deadline, setDeadline] = useState(
    dateFormater(jobsToEdit?.deadline) || ""
  );
  const [vacancies, setVacancies] = useState(jobsToEdit?.vacancies || 1);
  const [currency, setCurrency] = useState(
    jobsToEdit?.salary?.split("-")[0] || "EURO"
  );

  const [draftLoading, setDraftLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [invalidAssignee, setInvalidAssignee] = useState(false);
  const [isFuture, setIsFuture] = useState(jobsToEdit?.isFuture || false);

  const today = new Date().toISOString().split("T")[0];
  const { inputError, validateForm, resetError, isError, errorFields } =
    useFormValidation();

  const selectAssignee = (id) => {
    setAssignee(id);
    setInvalidAssignee(false);
    const selectedSubordinates = subordinates.filter((el) => el._id === id);
    if (id === session.id) {
      setContactName(session?.name);
      setContactEmail(session?.user?.email);
      setContactLinkedInAccount(session?.social);
      setContactPhone(session?.phone);
      setImageUrl(session?.image?.url);
      setContactDesignation(session?.designation ? session?.designation : "");
    } else {
      if (
        !selectedSubordinates[0]?.email ||
        !selectedSubordinates[0]?.designation 
      ) {
        notify("Please update the profile of sleceted assignee", "error");
        setInvalidAssignee(true);
      }

      setContactName(
        selectedSubordinates[0]?.name ? selectedSubordinates[0]?.name : ""
      );
      setContactEmail(
        selectedSubordinates[0]?.email ? selectedSubordinates[0]?.email : ""
      );
      setContactLinkedInAccount(
        selectedSubordinates[0]?.social ? selectedSubordinates[0]?.social : ""
      );
      setContactPhone(
        selectedSubordinates[0]?.phone ? selectedSubordinates[0]?.phone : ""
      );
      setContactDesignation(
        selectedSubordinates[0]?.designation
          ? selectedSubordinates[0]?.designation
          : ""
      );
      setImageUrl(
        selectedSubordinates[0]?.image?.url
          ? selectedSubordinates[0]?.image?.url
          : ""
      );
    }
  };

  let e = 0;
  const detectError = (action) => {
    if (action === "draft_button") {
      e += validateForm({
        value: title,
        name: "title",
        message: "Please add a Job Title",
      });
    }
    if (action === "post_button") {
      e += validateForm({
        value: title,
        name: "title",
        message: "Please add a Job Title",
      });

      e += validateForm({
        value: companyName,
        name: "companyName",
        message: "Please add a Company Name",
      });
      e += validateForm({
        value: type,
        name: "jobtype",
        message: "Please Select a Job Type",
      });
      e += validateForm({
        value: location,
        name: "location",
        message: "Please Select a Job Location",
      });
      e += validateForm({
        value: vacancies,
        name: "vacancies",
        pattern: /^[1-9][0-9]*$/,
        message: "Please add a number greater than zero",
      });
      e += validateForm({
        value: deadline,
        name: "deadline",
        message: "Please add a Deadline Date",
      });
      e += validateForm({
        value: summary,
        name: "summary",
        type: "string",
        min: 10,
        max: 300,
        message: "Please add Summary Description not more than 300 characters",
      });
      e += validateForm({
        value: contactName,
        name: "contactName",
        message: "Please add your Full Name",
      });
      e += validateForm({
        value: contactEmail,
        name: "contactEmail",
        message: "Please add your Email Adrress",
      });
      e += validateForm({
        value: recruiterWebsite,
        name: "website",
        message: "Please add your Web Address",
      });
      // e += validateForm({
      //   value: contactLinkedInAccount,
      //   name: "contactLinkedInAccount",
      //   message: "Please add your LinkedIn account URL",
      // });
      // e += validateForm({
      //   value: contactPhone,
      //   name: "contactPhone",
      //   message: "Please add your Phone / Mobile Number",
      // });
      e += validateForm({
        value: contactDesignation,
        name: "contactDesignation",
        message: "Please add your Designation",
      });
      e += validateForm({
        value: description === "<p><br></p>" ? "" : description,
        name: "description",
        message: "Please add Full Job Description",
      });
    }

    return e;
  };
  const resetForm = () => {
    setTitle("");
    setCompanyName("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setContactLinkedInAccount("");
    setContactDesignation("");
    setMinSalary("");
    setMaxSalary("");
    setDescription("");
    setType("");
    setLocation("");
    setVacancies("");
    setDeadline("");
    setSummary("");
    setCopy(false);
    setDraftLoading(false);
    setPostLoading(false);
    setJobsToEdit(null);
  };

  //Construct the job object that will be saved in db
  const jobData = {
    title,
    description,
    summary,
    recruiter: companyName,
    location,
    type,
    salary:
      minSalary || maxSalary
        ? currency + "-" + minSalary + "-" + maxSalary
        : "",
    deadline: deadline ? new Date(deadline) : new Date(),
    vacancies: stringParser(vacancies),
    companyType: companyType,
    ...(jobsToEdit && !copy ? {} : { postedBy: session?.id }),
    isFuture,
    ...(jobsToEdit && !copy
      ? {}
      : {
          assignment: [
            {
              assignedTo: assignee ? assignee : session?.id,
              assignedBy: session?.id,
              order: 0,
            },
          ],
        }),

    ...(jobsToEdit && !copy ? {} : { company: session?.company }),
  };

  //Function to the Save job
  const saveJob = async (e) => {
    e.preventDefault();

    if (invalidAssignee) {
      return notify("Please update the profile of sleceted assignee", "error");
    }

    let noOfErrors = detectError(e.target.name);
    if (noOfErrors > 0) {
      notify(
        e.target.name === "draft_button"
          ? "Please fill mandatory field"
          : "Please fill all mandatory fields",
        "warning"
      );
      return;
    }

    if (e.target.name === "draft_button") {
      setDraftLoading(true);
      setFilter("draft");
    }
    if (e.target.name === "post_button") {
      setPostLoading(true);
      setFilter("post");
    }
    try {
      if (e.target.name === "draft_button") {
        jobData.draft = true;
        jobData.publish = false;
      }
      if (e.target.name === "post_button") {
        jobData.draft = false;
        jobData.publish = true;
      }

      // Save the job in db
      const jobResponse = await axios.post("/api/private/job", {
        ...jobData,
        isDraft: e.target.name === "post_button" ? false : true,
      });
      //refetch job list
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
      //reset the form
      resetForm();
      //Success toast notification
      e.target.name === "draft_button"
        ? notify("Posted to Draft Jobs successfully", "success")
        : notify("Job has been posted successfully", "success");
      //Close the modal
      setOpen(!open);
    } catch (error) {
      notify("Something went wrong", "error");
    } finally {
      setDraftLoading(false);
      setPostLoading(false);
    }
  };

  //Function to Edit a Post

  const editJob = async (e) => {
    e.preventDefault();
    let noOfErrors = detectError(e.target.name);
    if (noOfErrors > 0) {
      notify(
        e.target.name === "draft_button"
          ? "Please fill mandatory field"
          : "Please fill all mandatory fields",
        "warning"
      );
      return;
    }

    if (e.target.name === "draft_button") {
      setDraftLoading(true);
      setFilter("draft");
    }
    if (e.target.name === "post_button") {
      setPostLoading(true);
      setFilter("post");
    }
    //Check if any data has changed
    if (_.isEqual(initialData, jobData)) {
      notify("Nothing has changed", "warning");
      setDraftLoading(false);
      setPostLoading(false);
      return;
    }
    const changesToSave = {};
    //Getting the changed data to save in db
    for (const key in initialData) {
      if (key === "deadline") {
        if (initialData[key].getTime() !== jobData[key].getTime()) {
          changesToSave[key] = jobData[key];
        }
      } else {
        if (initialData[key] !== jobData[key]) {
          changesToSave[key] = jobData[key];
        }
      }
    }

    if (e.target.name === "draft_button") {
      changesToSave.draft = true;
      changesToSave.publish = false;
    }
    if (e.target.name === "post_button") {
      changesToSave.draft = false;
      changesToSave.publish = true;
    }

    try {
      const jobResponse = await axios.put(
        `/api/private/job/${jobsToEdit?._id}`,
        {
          ...changesToSave,
        }
      );
      //refetch job list
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
      //reset the form
      resetForm();
      //Success toast notification
      notify("Job has been edited successfully", "success");
      //Close the modal
      setOpen(!open);
    } catch (error) {
      notify("Something went wrong", "error");
    } finally {
      setDraftLoading(false);
      setPostLoading(false);
    }
  };

  return (
    <div
      style={{ height: "100%" }}
      className=" bg-gray-700/30  z-50 fixed inset-0 flex justify-center items-center  "
    >
      <div
        className="px-3 flex flex-col  items-center justify-center  bg-gray-50 w-[90%] md:w-1/2 py-10  rounded-lg   max-h-[90%]
      animate__animated animate__slideInRight relative
        "
      >
        <XCircleIcon
          className="absolute  w-8 h-8  -top-2 -right-2  z-50 text-gray-600 cursor-pointer  "
          onClick={() => {
            setOpen(!open);
            setJobsToEdit(null);
          }}
        />
        <div className="w-[95%] self-start flex flex-col items-center justify-center gap-1 mb-6">
          <p className=" text-gray-500 font-semibold">Add a job</p>
          <hr className="w-full mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
        </div>
        <div
          className="flex flex-col w-full scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full
        scrollbar-track-rounded-full  scrollbar-track-h-20 scrollbar-track-mt-2 overflow-y-scroll"
        >
          <form className="w-[95%] flex flex-col gap-2 justify-center items-center px-2">
            <h2 className="text-primary-100  font-semibold pb-4">
              Job Summary
            </h2>

            <div className="flex flex-col md:flex-row gap-2 w-full ">
              <div className="w-full md:w-1/2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  id="job-title"
                  name="title"
                  type="text"
                  required
                  className={`${
                    errorFields.includes("title")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                  placeholder="Job Title"
                />
                <div>
                  <Error errorArray={inputError} fieldName={"title"} />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className={`${
                    errorFields.includes("companyName")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                  placeholder="Company Name"
                />
                <div>
                  <Error errorArray={inputError} fieldName={"companyName"} />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full ">
              <div className="w-full md:w-1/2">
                <select
                  name="jobtype"
                  value={type}
                  onChange={(e) => {
                    resetError(e.target.name);
                    setType(e.target.value);
                  }}
                  className={`${
                    errorFields.includes("jobtype")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-600 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
                <div>
                  <Error errorArray={inputError} fieldName={"jobtype"} />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  name="location"
                  type="text"
                  required
                  className={`${
                    errorFields.includes("location")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                  placeholder="Job Location"
                />
                <div>
                  <Error errorArray={inputError} fieldName={"location"} />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full ">
              <div className="w-full md:w-1/2">
                <input
                  value={vacancies}
                  min="1"
                  onChange={(e) => setVacancies(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  name="vacancies"
                  type="number"
                  required
                  className={`${
                    errorFields.includes("vacancies")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                  placeholder="No of Vacancies"
                />

                <div>
                  <Error errorArray={inputError} fieldName={"vacancies"} />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  onFocus={(e) => {
                    resetError(e.target.name);
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    e.target.type = "text";
                  }}
                  onKeyDown={(e) => e.preventDefault()}
                  min={today}
                  name="deadline"
                  type="text"
                  required
                  placeholder="Deadline"
                  className={`${
                    errorFields.includes("deadline")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error errorArray={inputError} fieldName={"deadline"} />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="w-full md:w-[30%]">
                <select
                  name="currency"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                  }}
                  className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-500  focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm"
                >
                  <option value="EURO">EURO</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div className="w-full md:w-[35%]">
                <input
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  name="maxSalary"
                  type="number"
                  min={0}
                  required
                  className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm"
                  placeholder="Max Salary Per Annum"
                />
              </div>
              <div className="w-full md:w-[35%]">
                <input
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  name="minSalary"
                  type="number"
                  min={0}
                  required
                  className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm"
                  placeholder="Min Salary Per Annum"
                />
              </div>
            </div>

            <div className="flex flex-col  gap-2 w-full mb-8">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                onFocus={(e) => resetError(e.target.name)}
                placeholder="Summary Description not more than 300 characters"
                name="summary"
                cols={40}
                rows={4}
                required
                className={`${
                  errorFields.includes("summary")
                    ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                    : ""
                } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
              />
              <div>
                <Error errorArray={inputError} fieldName={"summary"} />
              </div>
            </div>

            <h2 className="text-primary-100 text-center font-semibold pb-4">
              Contact Information
            </h2>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-1/2 ">
              <div className="w-full flex  items-center gap-4 justify-center">
                <select
                  disabled={jobsToEdit && !copy}
                  value={assignee}
                  name="assignee"
                  onChange={(e) => {
                    selectAssignee(e.target.value);
                  }}
                  className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-500  focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm"
                >
                  <option value={session?.id}>Select Assignee</option>
                  {subordinates.map((el) => (
                    <option
                      key={el._id}
                      value={el._id}
                      className={`${
                        el.isExternal ? "font-semibold text-red-600" : ""
                      }`}
                    >
                      {`${el.designation}->${el.name} ${
                        el.isExternal ? "(External)" : ""
                      }`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full ">
              <div className="w-full md:w-1/2">
                <input
                  readOnly
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  name="contactName"
                  type="text"
                  placeholder="Full Name"
                  required
                  className={`${
                    errorFields.includes("contactName")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error errorArray={inputError} fieldName={"contactName"} />
                </div>
              </div>

              <div className="w-full md:w-1/2 ">
                <div className="w-full  flex  items-center gap-4 justify-center">
                  <div className="relative w-10 h-10 border-[1px] border-gray-600 rounded-full ">
                    <Image
                      fill
                      object-fit="contain"
                      src={imageUrl}
                      alt="User Image"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full ">
              <div className="w-full md:w-1/2">
                <input
                  readOnly
                  value={recruiterWebsite}
                  onChange={(e) => setRecruiterWebsite(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  name="website"
                  type="text"
                  placeholder="Website"
                  required
                  className={`${
                    errorFields.includes("website")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error errorArray={inputError} fieldName={"website"} />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <input
                  readOnly
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  placeholder="Email"
                  name="contactEmail"
                  type="text"
                  required
                  className={`${
                    errorFields.includes("contactEmail")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error errorArray={inputError} fieldName={"contactEmail"} />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="w-full md:w-1/2">
                <input
                  readOnly
                  value={contactLinkedInAccount}
                  onChange={(e) => setContactLinkedInAccount(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  placeholder="LinkedIN URL"
                  name="contactLinkedInAccount"
                  type="text"
                  required
                  className={`${
                    errorFields.includes("contactLinkedInAccount")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error
                    errorArray={inputError}
                    fieldName={"contactLinkedInAccount"}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <input
                  readOnly
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  placeholder="Phone / Mobile Number"
                  name="contactPhone"
                  type="tel"
                  required
                  className={`${
                    errorFields.includes("contactPhone")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error errorArray={inputError} fieldName={"contactPhone"} />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full mb-8">
              <div className="w-full md:w-1/2">
                <input
                  readOnly
                  value={contactDesignation}
                  onChange={(e) => setContactDesignation(e.target.value)}
                  onFocus={(e) => resetError(e.target.name)}
                  placeholder="Designation"
                  name="contactDesignation"
                  type="text"
                  required
                  className={`${
                    errorFields.includes("contactDesignation")
                      ? " ring-2 ring-opacity-30 ring-red-600 bg-red-300/5"
                      : ""
                  } relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm`}
                />
                <div>
                  <Error
                    errorArray={inputError}
                    fieldName={"contactDesignation"}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <select
                  value={companyType}
                  name="companyType"
                  onChange={(e) => {
                    setCompanyType(e.target.value);
                  }}
                  className="relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-500  focus:z-10 hover:border-primary-200 focus:border-primary-100 focus:outline-none focus:ring-primary-100 sm:text-sm"
                >
                  <option value="">Select Company Type</option>
                  <option value="Direct">Direct</option>
                  <option value="Agency">Agency</option>
                </select>
                <div>
                  <Error errorArray={inputError} fieldName={"companyType"} />
                </div>
              </div>
            </div>

            <h2 className="text-primary-100 text-center font-semibold pb-4">
              Job Description
            </h2>

            <div className="w-full quill-container ">
              <Editor
                name="description"
                errorFields={errorFields}
                richText={description}
                setRichText={setDescription}
                resetError={resetError}
                validateForm={validateForm}
                placeholder={"Add full job description"}
              />
              <div>
                <Error errorArray={inputError} fieldName={"description"} />
              </div>
            </div>

            <div className="flex gap-2 justify-start items-center py-4 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-gray-600 "
                checked={isFuture}
                onChange={() => {
                  setIsFuture(!isFuture);
                }}
              />
              <p>Future Job</p>
            </div>

            <div className="w-full flex justify-center gap-2 md:justify-around items-center mt-2">
              <button
                name="post_button"
                type="submit"
                disabled={postLoading || draftLoading || isError}
                onClick={(e) => {
                  jobsToEdit && !copy ? editJob(e) : saveJob(e);
                }}
                className=" mt-2 relative w-[30%] md:w-[40%] text-white bg-primary-100 hover:bg-primary-200 font-medium rounded-md text-sm px-3 md:px-5 py-2 md:py-2.5 text-center disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
              >
                {jobsToEdit?.draft === false && !copy
                  ? "Edit Job"
                  : jobsToEdit?.draft === true && !copy
                  ? "Post Job"
                  : "Post Job"}
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
                  {postLoading ? (
                    <ThreeCircles
                      height="30"
                      width="30"
                      color="#2557a7"
                      ariaLabel="three-circles-rotating"
                    />
                  ) : null}
                </div>
              </button>

              {jobsToEdit?.draft === true && !copy ? (
                <button
                  name="draft_button"
                  type="submit"
                  disabled={postLoading || draftLoading || isError}
                  onClick={(e) => {
                    jobsToEdit && !copy ? editJob(e) : saveJob(e);
                  }}
                  className=" mt-2 relative w-[50%] md:w-[40%] text-white bg-primary-100 hover:bg-primary-200 font-medium rounded-md text-sm px-3 md:px-5 py-2 md:py-2.5 text-center disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
                >
                  Edit Draft
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
                    {draftLoading ? (
                      <ThreeCircles
                        height="30"
                        width="30"
                        color="#2557a7"
                        ariaLabel="three-circles-rotating"
                      />
                    ) : null}
                  </div>
                </button>
              ) : jobsToEdit?.draft === false && !copy ? null : (
                <button
                  name="draft_button"
                  type="submit"
                  disabled={postLoading || draftLoading || isError || isFuture}
                  onClick={(e) => {
                    jobsToEdit && !copy ? editJob(e) : saveJob(e);
                  }}
                  className=" mt-2 relative  w-[50%] md:w-[40%] text-white bg-primary-100 hover:bg-primary-200 font-medium rounded-md text-sm px-3 md:px-5 py-2 md:py-2.5 text-center disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
                >
                  Save As Draft
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
                    {draftLoading ? (
                      <ThreeCircles
                        height="30"
                        width="30"
                        color="#2557a7"
                        ariaLabel="three-circles-rotating"
                      />
                    ) : null}
                  </div>
                </button>
              )}

              {}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddJobModal;
