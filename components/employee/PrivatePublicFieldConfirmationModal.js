import React, { useEffect, useState } from "react";
import "animate.css";
import notify from "../../utils/tostNotification";
import {
  LockOpenIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const PrivatePublicFieldConfirmationModal = ({
  open,
  setOpen,
  singleJob,
  setSingleJob,
}) => {
  const { data: session } = useSession();
  const [publicFields, setPublicFields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [individualFieldLoading, setIndividualFieldLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (msg) {
      setTimeout(() => setMsg(null), 4000);
    }
  }, [msg]);

  //Fetch data on modal open
  useEffect(() => {
    let fetchJob = async () => {
      setLoading(true);
      let result = await axios.get(`/api/public/job/${singleJob?._id}`);
      setPublicFields(
        result.data.applicants.filter((el) => el.user === session?.id)?.[0]
          ?.publicFields
      );
      setLoading(false);
    };
    fetchJob();
  }, []);
  //function to close modal
  const handleClose = () => {
    setOpen(!open);
    setSingleJob(null);
  };
  //Function to toggle field private or public
  const togglePrivatePublic = async (field) => {
    const FieldName =
      field === "phone"
        ? "Phone Number"
        : field === "social"
        ? "LinkedIn URL"
        : field === "about"
        ? "About Me"
        : field === "email"
        ? "Email"
        : field === "address"
        ? "Address"
        : field === "currentEmployer"
        ? "Current Employer"
        : field === "currentEmployment"
        ? "Current Role"
        : field === "availableFrom"
        ? "Available From"
        : field === "lastName"
        ? "Last Name"
        : field;

    setMsg(null);
    setCurrent(field);
    setIndividualFieldLoading(true);
    try {
      const updatedMsg =
        field === "addAll"
          ? `All fields designated as public`
          : field === "removeAll"
          ? "All fields designated as private"
          : publicFields?.includes(field)
          ? `${FieldName} designated as private`
          : `${FieldName} designated as public`;
      let response = await axios.put(
        `/api/private/user/toggleFieldStatus/${session?.id}`,
        {
          jobId: singleJob._id,
          action:
            field === "addAll"
              ? "addField"
              : field === "removeAll"
              ? "removeField"
              : publicFields?.includes(field)
              ? "removeField"
              : "addField",
          field: field,
        }
      );
      let updatedJobListAndUser = response?.data?.result[0];
      setMsg(updatedMsg);
      setPublicFields(updatedJobListAndUser.publicFields);
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    } finally {
      setIndividualFieldLoading(false);
    }
  };

  return open ? (
    <div
      className={`fixed  inset-0 z-50 flex flex-col items-center justify-center bg-black/20 `}
    >
      <div
        className={`bg-white flex flex-col  justify-center w-[93vw]   xs:w-[420px] rounded-lg shadow-lg animate__animated animate__slideInRight`}
      >
        <div className="flex justify-between w-full pb-2 pt-4 px-4">
          <div className="text-lg font-semibold text-gray-600">
            Share or keep private your profile details
          </div>
          <div
            className="font-semibold text-md text-gray-600 cursor-pointer"
            onClick={handleClose}
          >
            X
          </div>
        </div>
        <div className="w-full h-[0.5px] bg-gray-600/40"></div>
        <div className=" flex flex-col p-4 space-y-6">
          <div>
            <p className="text-xs text-gray-600">
              By default, all profile details listed are designated as private.
              Change your privacy setting here and share with this job contact.
            </p>
          </div>
          {msg && (
            <div className="  self-center">
              <div className="animate__animated animate__fadeIn px-2 py-1 bg-green-300/30 rounded-md text-xs font-semibold text-secondary-100 flex gap-4 justify-between items-center origin-top-lfte transform s">
                {msg}
                <XMarkIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setMsg(null)}
                />
              </div>
            </div>
          )}
          {!loading && publicFields && (
            <>
              <div className="flex gap-4 justify-center items-center px-2 sm:px-4 ">
                <div
                  id="email"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    Email
                  </span>
                  {individualFieldLoading && current === "email" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("email") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  id="lastName"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    Last Name
                  </span>
                  {individualFieldLoading && current === "lastName" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("lastName") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 sm:gap-4 justify-center items-center px-2 sm:px-4 ">
                <div
                  id="address"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    Address
                  </span>
                  {individualFieldLoading && current === "address" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("address") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  id="currentEmployment"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    Current Role
                  </span>
                  {individualFieldLoading && current === "currentEmployment" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("currentEmployment") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center items-center px-2 sm:px-4 ">
                <div
                  id="phone"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    Phone Number
                  </span>
                  {individualFieldLoading && current === "phone" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("phone") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  id="availableFrom"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm  text-gray-600   sm:block ">
                    Available From
                  </span>
                  {individualFieldLoading && current === "availableFrom" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("availableFrom") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center items-center px-2 sm:px-4 ">
                <div
                  id="social"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    LinkedIn URL
                  </span>
                  {individualFieldLoading && current === "social" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("social") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  id="about"
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    About Me
                  </span>
                  {individualFieldLoading && current === "about" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("about") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-start items-center px-2 sm:px-4 ">
                <div
                  className="flex justify-start items-center w-1/2 gap-3 cursor-pointer"
                  id="currentEmployer"
                  onClick={(e) => togglePrivatePublic(e.currentTarget.id)}
                >
                  <span className="text-sm text-gray-600   sm:block">
                    Current Employer
                  </span>
                  {individualFieldLoading && current === "currentEmployer" ? (
                    <Oval
                      height="17"
                      width="17"
                      color="#003A9B"
                      secondaryColor="#144D8E"
                    />
                  ) : publicFields?.includes("currentEmployer") ? (
                    <LockOpenIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div
                className="flex gap-4  items-center pt-2 pb-4"
                onClick={() =>
                  togglePrivatePublic(
                    publicFields?.length >= 9 ? "removeAll" : "addAll"
                  )
                }
              >
                <div className="flex justify-center items-center w-1/2 gap-3 cursor-pointer bg-primary-100 rounded-md">
                  <span className="text-sm text-white  sm:block text-center py-2 font-semibold ">
                    {publicFields?.length >= 9
                      ? "Make all fields private"
                      : "Make all fields public"}
                  </span>
                </div>
              </div>
            </>
          )}
          {loading && !publicFields && (
            <div className="w-full h-full flex justify-center items-center">
              <Oval
                height="50"
                width="50"
                color="#003A9B"
                secondaryColor="#144D8E"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default PrivatePublicFieldConfirmationModal;
